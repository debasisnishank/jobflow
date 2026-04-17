import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getCurrentUser } from "@/utils/user.utils";
import { ExternalServiceError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { question, questionType, userAnswer, jobDescription, resumeData } = body;

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new ExternalServiceError(
        "OPENAI_API_KEY is not configured",
        { context: { provider: "OpenAI", function: "getMockInterviewFeedback" } }
      );
    }

    const { getAIConfigWithDefaults } = await import("@/lib/admin/ai-config-helper");
    const config = await getAIConfigWithDefaults("mock-interview-feedback");

    const systemPrompt = `${config.systemPrompt}

You are an expert interview coach providing constructive feedback on interview answers.

Evaluate the candidate's answer across these dimensions:
1. **Relevance** (0-25): How well does the answer address the question?
2. **Clarity** (0-25): Is the answer well-structured, clear, and easy to follow?
3. **Depth** (0-25): Does it show deep understanding with specific examples?
4. **Completeness** (0-25): Does it cover all aspects of the question?

Provide:
1. **Overall Score (0-100)**: Sum of the dimension scores
2. **Strengths**: 2-3 specific things they did well (be specific!)
3. **Suggestions**: 2-3 actionable improvements with examples
4. **Detailed Feedback**: Constructive analysis of their answer

Be encouraging but honest. Focus on helping them improve.

IMPORTANT: Return ONLY valid JSON with these fields:
- score: number from 0-100
- strengths: array of strings
- suggestions: array of strings  
- feedback: detailed string

Do NOT wrap in markdown code blocks.`;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      [
        "human",
        `Question Type: ${questionType}

Question: ${question}

Candidate's Answer: ${userAnswer}

${jobDescription ? `Job Description Context:\n${jobDescription}\n` : ""}
${resumeData ? `Candidate Resume Context:\n${resumeData}\n` : ""}

Provide detailed feedback on this answer.`,
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
      question,
      questionType,
      userAnswer,
      jobDescription: jobDescription || "",
      resumeData: resumeData || "",
    });

    const encoder = new TextEncoder();

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              controller.enqueue(encoder.encode(chunk));
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
  } catch (error: any) {
    console.error("Error generating feedback:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate feedback" },
      { status: 500 }
    );
  }
}


