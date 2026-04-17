import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getCurrentUser } from "@/utils/user.utils";
import { ExternalServiceError } from "@/lib/errors";
import prisma from "@/lib/db";

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
    const { jobId, resumeId, interviewType, numQuestions = 5 } = body;

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
        // Convert resume to text format
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

        // Add skills from Resume level (not ResumeSection)
        if (resume.Skills && resume.Skills.length > 0) {
          resumeText += `Skills: ${resume.Skills.map((s) => s.name).join(", ")}\n\n`;
        }

        resumeData = resumeText;
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new ExternalServiceError(
        "OPENAI_API_KEY is not configured",
        { context: { provider: "OpenAI", function: "generateMockInterviewQuestions" } }
      );
    }

    const { getAIConfigWithDefaults } = await import("@/lib/admin/ai-config-helper");
    const config = await getAIConfigWithDefaults("mock-interview-questions");

    const systemPrompt = `${config.systemPrompt}

Return ONLY a JSON array of question objects with this structure:
[
  {
    "question": "The interview question",
    "questionType": "behavioral" | "technical" | "situational" | "case_study" | "system_design" | "other",
    "order": 1
  },
  ...
]

Make questions:
- Relevant to the job role and candidate's experience
- Progressive (start with easier questions, build to more complex)
- Realistic and similar to actual interview questions
- Appropriate for {interviewType} interviews
- If technical interview, include coding/system design questions
- If behavioral, focus on STAR method questions
- If mixed, include both types`;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      [
        "human",
        `Job Information:
{jobData}

Candidate Resume:
{resumeData}

Generate {numQuestions} interview questions.`,
      ],
    ]);

    const model = new ChatOpenAI({
      modelName: config.modelName,
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: config.temperature,
      streaming: true,
      maxTokens: config.maxTokens,
    });

    const chain = prompt.pipe(model as any).pipe(new StringOutputParser());
    const stream = await chain.stream({
      interviewType: interviewType,
      numQuestions: numQuestions.toString(),
      jobData: jobData ? JSON.stringify(jobData, null, 2) : "No job information provided",
      resumeData: resumeData || "No resume provided",
    });

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

            // Try to parse and validate the JSON response
            try {
              // Extract JSON from markdown code blocks if present
              const jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                               fullResponse.match(/```\s*([\s\S]*?)\s*```/);
              const jsonString = jsonMatch ? jsonMatch[1] : fullResponse;
              const questions = JSON.parse(jsonString.trim());
              
              if (!Array.isArray(questions)) {
                throw new Error("Response is not an array");
              }
            } catch (parseError) {
              // If parsing fails, the client will handle it
              console.error("Failed to parse questions JSON:", parseError);
            }

            controller.close();
          } catch (error) {
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
    const errorMessage = error instanceof Error ? error.message : "Failed to generate questions";
    console.error("Error generating interview questions:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

