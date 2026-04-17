"use strict";
import "server-only";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getResumeById } from "@/actions/profile.actions";
import { convertResumeToText } from "@/utils/ai.utils";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ExternalServiceError, ValidationError } from "@/lib/errors";
import { incrementAIUsage } from "@/lib/ai-usage";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  try {
    const { validateFeatureAccess, FeatureType, createAccessDeniedResponse } = await import("@/lib/feature-access-control");
    const validation = await validateFeatureAccess(FeatureType.AI_RESUME_REVIEW);

    if (!validation.allowed) {
      return createAccessDeniedResponse(validation);
    }

    const { resumeId } = (await req.json()) as { resumeId: string };

    if (!resumeId) {
      throw new ValidationError("ResumeId is required", {
        context: { hasResumeId: !!resumeId },
      });
    }

    const resume = await getResumeById(resumeId);

    if (!resume) {
      throw new ValidationError("Resume not found", {
        context: { resumeId },
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new ExternalServiceError(
        "OPENAI_API_KEY is not configured. Please set it in your environment variables.",
        {
          context: { provider: "OpenAI", function: "generateResumeSummary" },
        }
      );
    }

    const resumeText = await convertResumeToText(resume);
    const { getAIConfigWithDefaults } = await import("@/lib/admin/ai-config-helper");
    const config = await getAIConfigWithDefaults("resume-generate-summary");

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", config.systemPrompt],
      [
        "human",
        `Generate a professional resume summary based on the following resume:

{resume}`,
      ],
    ]);

    const model = new ChatOpenAI({
      modelName: config.modelName,
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: config.temperature,
      maxConcurrency: 1,
      maxTokens: config.maxTokens,
      streaming: true,
    });

    const chain = prompt.pipe(model as any).pipe(new StringOutputParser());
    const stream = await chain.stream({ resume: resumeText });

    const encoder = new TextEncoder();
    const userId = session?.accessToken?.sub;

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();

            // Track usage after successful generation
            if (userId) {
              await incrementAIUsage("generate_summary", userId).catch(console.error);
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Stream error";
            controller.enqueue(encoder.encode(`Error: ${errorMessage}`));
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      }
    );
  } catch (error) {
    if (error instanceof ExternalServiceError || error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    const wrappedError =
      error instanceof Error
        ? new ExternalServiceError("Error generating summary.", {
          context: { provider: "OpenAI" },
          originalError: error,
        })
        : new ExternalServiceError("Error generating summary.", {
          context: { provider: "OpenAI" },
        });

    return NextResponse.json({ error: wrappedError.message }, { status: wrappedError.statusCode });
  }
};
