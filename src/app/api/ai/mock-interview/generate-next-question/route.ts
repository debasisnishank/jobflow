import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getCurrentUser } from "@/utils/user.utils";
import { ExternalServiceError } from "@/lib/errors";
import prisma from "@/lib/db";
import { getScenarioById } from "@/lib/interview-scenarios";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { validateFeatureAccess, FeatureType, createAccessDeniedResponse } = await import("@/lib/feature-access-control");
    const validation = await validateFeatureAccess(FeatureType.MOCK_INTERVIEW);

    if (!validation.allowed) {
      return createAccessDeniedResponse(validation);
    }

    const body = await req.json();
    const {
      sessionId,
      jobId,
      resumeId,
      interviewType,
      previousQuestions = [],
      previousAnswers = [],
      isFollowUp = false,
      parentQuestion = null,
      parentAnswer = null,
      elapsedMinutes = 0,
      remainingMinutes = 45,
      totalDuration = 45,
      currentQuestionCount = 0,
    } = body;

    // Fetch job and resume data
    let jobData = null;
    let resumeData = null;

    if (jobId) {
      const job = await prisma.job.findFirst({
        where: {
          id: jobId,
          userId: user.id,
        },
        include: {
          JobTitle: true,
          Company: true,
        },
      });
      if (job) {
        jobData = {
          title: job.JobTitle.label,
          company: job.Company.label,
          description: job.description,
          jobType: job.jobType,
        };
      }
    }

    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          profile: {
            userId: user.id,
          },
        },
        include: {
          ContactInfo: true,
          Skills: true,
          ResumeSections: {
            include: {
              summary: true,
              workExperiences: {
                include: {
                  Company: true,
                  jobTitle: true,
                  location: true,
                },
              },
              educations: {
                include: {
                  location: true,
                },
              },
            },
          },
        },
      });

      if (resume) {
        let resumeText = "";
        if (resume.ContactInfo) {
          resumeText += `Name: ${resume.ContactInfo.firstName} ${resume.ContactInfo.lastName}\n`;
          resumeText += `Email: ${resume.ContactInfo.email}\n`;
          resumeText += `Phone: ${resume.ContactInfo.phone}\n`;
          resumeText += `Headline: ${resume.ContactInfo.headline}\n\n`;
        }

        resume.ResumeSections.forEach((section) => {
          if (section.sectionType === "summary" && section.summary) {
            resumeText += `Summary: ${section.summary.content}\n\n`;
          }

          if (section.workExperiences.length > 0) {
            resumeText += "Work Experience:\n";
            section.workExperiences.forEach((exp) => {
              resumeText += `- ${exp.jobTitle.label} at ${exp.Company.label}\n`;
              resumeText += `  ${exp.description}\n`;
            });
            resumeText += "\n";
          }

          if (section.educations.length > 0) {
            resumeText += "Education:\n";
            section.educations.forEach((edu) => {
              resumeText += `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}\n`;
            });
            resumeText += "\n";
          }
        });

        if (resume.Skills && resume.Skills.length > 0) {
          resumeText += `Skills: ${resume.Skills.map((s) => s.name).join(", ")}\n\n`;
        }

        resumeData = resumeText;
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new ExternalServiceError(
        "OPENAI_API_KEY is not configured",
        { context: { provider: "OpenAI", function: "generateNextQuestion" } }
      );
    }

    // Fetch session to get scenarioId
    let scenarioId: string | null = null;
    if (sessionId) {
      const session = await prisma.mockInterviewSession.findFirst({
        where: { id: sessionId },
      });
      scenarioId = (session as any)?.scenarioId || null;
    }

    // Get scenario template if scenarioId is provided
    const scenario = scenarioId ? getScenarioById(scenarioId) : null;
    const scenarioSystemPrompt = scenario?.systemPrompt || "";

    let prompt: ChatPromptTemplate;

    if (isFollowUp && parentQuestion && parentAnswer) {
      // Generate a follow-up question based on the previous answer
      const systemPrompt = scenarioSystemPrompt
        ? `${scenarioSystemPrompt}\n\nThe candidate was asked: "{parentQuestion}"\nThey answered: "{parentAnswer}"\n\nAnalyze their answer and generate ONE natural follow-up question that:\n- Probes deeper into their response if it was vague\n- Asks for specific examples if they gave general statements\n- Clarifies any confusion or contradictions\n- Only asks a follow-up if truly needed (if answer was complete, return null)`
        : `You are an expert interview coach conducting a {interviewType} mock interview.\nThe candidate was asked: "{parentQuestion}"\nThey answered: "{parentAnswer}"\n\nAnalyze their answer and generate ONE natural follow-up question that:\n- Probes deeper into their response if it was vague\n- Asks for specific examples if they gave general statements\n- Clarifies any confusion or contradictions\n- Only asks a follow-up if truly needed (if answer was complete, return null)`;

      prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `${systemPrompt}\n\nReturn ONLY a JSON object:\n{{\n  "question": "The follow-up question" | null,\n  "questionType": "behavioral" | "technical" | "situational" | "case_study" | "system_design" | "other",\n  "isFollowUp": true,\n  "reason": "Why this follow-up is needed (or why not)"\n}}\n\nIf the answer was complete and doesn't need a follow-up, set question to null.`,
        ],
        [
          "human",
          `Based on the candidate's answer, determine if a follow-up question is needed.
          Job Context: {jobData}
          Candidate Resume: {resumeData}`,
        ],
      ]);
    } else {
      // Generate the next main question
      const questionCount = previousQuestions.length;
      const systemPrompt = scenarioSystemPrompt
        ? `${scenarioSystemPrompt}\n\nGenerate the NEXT question in the interview sequence. This should feel like a natural conversation, not a scripted list.\n\nPrevious questions asked (${questionCount} so far):\n{previousQAText}\n\nGenerate ONE new question that:\n- Builds naturally on the conversation\n- Hasn't been asked yet\n- Is appropriate for {interviewType} interviews\n- Feels like a real interviewer would ask it next\n- References the candidate's resume or previous answers when relevant\n- Continue generating questions until the interview is comprehensive (aim for 5-8 questions total)`
        : `You are an expert interview coach conducting a {interviewType} mock interview.\nGenerate the NEXT question in the interview sequence. This should feel like a natural conversation, not a scripted list.\n\nPrevious questions asked (${questionCount} so far):\n{previousQAText}\n\nGenerate ONE new question that:\n- Builds naturally on the conversation\n- Hasn't been asked yet\n- Is appropriate for {interviewType} interviews\n- Feels like a real interviewer would ask it next\n- References the candidate's resume or previous answers when relevant\n- Continue generating questions until the interview is comprehensive (aim for 5-8 questions total)`;

      prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `${systemPrompt}\n\nReturn ONLY a JSON object:\n{{\n  "question": "The interview question",\n  "questionType": "behavioral" | "technical" | "situational" | "case_study" | "system_design" | "other",\n  "isFollowUp": false\n}}\n\nNote: The order will be calculated automatically based on the number of previous questions.`,
        ],
        [
          "human",
          `Job Information:
{jobData}

Candidate Resume:
{resumeData}

Generate the next question in this {interviewType} interview.`,
        ],
      ]);
    }

    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
      streaming: true,
      maxTokens: 1000,
    });

    const chain = prompt.pipe(model as any).pipe(new StringOutputParser());

    const promptVars: any = {
      interviewType: interviewType,
      jobData: jobData ? JSON.stringify(jobData, null, 2) : "No job information provided",
      resumeData: resumeData || "No resume provided",
      elapsedMinutes,
      remainingMinutes,
      totalDuration,
      currentQuestionCount,
    };

    if (isFollowUp) {
      promptVars.parentQuestion = parentQuestion;
      promptVars.parentAnswer = parentAnswer;
    } else {
      const previousQAText = previousQuestions.map((q: string, i: number) => {
        return `Q${i + 1}: ${q}\nA${i + 1}: ${previousAnswers[i] || "Not answered yet"}`;
      }).join("\n\n");

      promptVars.previousQAText = previousQuestions.length > 0
        ? previousQAText
        : "This is the first question.";
    }

    const stream = await chain.stream(promptVars);

    const encoder = new TextEncoder();

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          let fullResponse = "";
          try {
            for await (const chunk of stream) {
              fullResponse += chunk;
              controller.enqueue(encoder.encode(chunk));
            }

            // Validate the response before closing
            try {
              // Extract JSON from potential markdown code blocks
              const jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
                fullResponse.match(/```\s*([\s\S]*?)\s*```/);
              let jsonString = jsonMatch ? jsonMatch[1] : fullResponse;

              // Sanitize the JSON string to fix common issues
              jsonString = jsonString.trim();

              // Remove any trailing commas before closing braces/brackets
              jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');

              // Fix unterminated decimal numbers (e.g., "1." -> "1.0")
              jsonString = jsonString.replace(/(\d+)\.(\s*[,}\]])/g, '$1.0$2');

              // Remove any control characters that might break parsing
              jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');

              const parsed = JSON.parse(jsonString);

              // Validate required fields
              if (!isFollowUp && (!parsed.question || parsed.question.trim().length === 0)) {
                throw new Error("Generated question is empty");
              }
            } catch (validationError) {
              console.error("Response validation failed:", validationError);
              console.error("Response content:", fullResponse);
              // Still close the stream, let client handle the error
            }

            controller.close();
          } catch (error) {
            console.error("Stream error:", error);
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no",
        },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate question";
    console.error("Error generating next question:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

