"use strict";
import "server-only";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ExternalServiceError, ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { messages, resumeData } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new ValidationError("Messages array is required", {
        context: { hasMessages: !!messages },
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new ExternalServiceError(
        "OPENAI_API_KEY is not configured. Please set it in your environment variables.",
        {
          context: { provider: "OpenAI", function: "aiAssistant" },
        }
      );
    }

    const resumeContext = resumeData
      ? `
Resume Information:
- Name: ${resumeData.contactInfo?.firstName || ""} ${resumeData.contactInfo?.lastName || ""}
- Headline: ${resumeData.contactInfo?.headline || ""}
- Summary: ${resumeData.summary || "No summary provided"}
- Work Experience: ${resumeData.workExperiences?.length || 0} positions
- Education: ${resumeData.educations?.length || 0} entries
- Skills: ${resumeData.skills?.map((s: any) => s.name).join(", ") || "None listed"}
`
      : "";

    const { getAIConfigWithDefaults } = await import("@/lib/admin/ai-config-helper");
    const config = await getAIConfigWithDefaults("ai-assistant");
    const systemPrompt = `${config.systemPrompt}

${resumeContext ? `You have access to the user's current resume information:\n${resumeContext}` : ""}`;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const prompt = ChatPromptTemplate.fromMessages(
      formattedMessages.map((msg: any) => [msg.role, msg.content])
    );

    const model = new ChatOpenAI({
      modelName: config.modelName,
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: config.temperature,
      maxConcurrency: 1,
      maxTokens: config.maxTokens,
      streaming: true,
    });

    const chain = prompt.pipe(model as any).pipe(new StringOutputParser());
    const stream = await chain.stream({});

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
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    if (error instanceof ExternalServiceError || error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    const wrappedError =
      error instanceof Error
        ? new ExternalServiceError("Error getting AI response.", {
            context: { provider: "OpenAI" },
            originalError: error,
          })
        : new ExternalServiceError("Error getting AI response.", {
            context: { provider: "OpenAI" },
          });

    return NextResponse.json({ error: wrappedError.message }, { status: wrappedError.statusCode });
  }
}
