import "server-only";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ExternalServiceError, ValidationError } from "@/lib/errors";
import { handleApiError, requireAuth } from "@/lib/api-error-handler";
import { incrementAIUsage } from "@/lib/ai-usage";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const authError = requireAuth(session);
    if (authError) return authError;

    const { validateFeatureAccess, FeatureType, createAccessDeniedResponse } = await import("@/lib/feature-access-control");
    const validation = await validateFeatureAccess(FeatureType.AI_RESUME_REVIEW);

    if (!validation.allowed) {
      return createAccessDeniedResponse(validation);
    }

    const { jobTitle, company, existingDescription } = await req.json();

    if (!jobTitle || !company) {
      throw new ValidationError("Job title and company are required", {
        context: { hasJobTitle: !!jobTitle, hasCompany: !!company },
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new ExternalServiceError(
        "OPENAI_API_KEY is not configured. Please set it in your environment variables.",
        {
          context: { provider: "OpenAI", function: "generateBullets" },
        }
      );
    }

    const { getAIConfigWithDefaults } = await import("@/lib/admin/ai-config-helper");
    const config = await getAIConfigWithDefaults("resume-generate-bullets");

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", config.systemPrompt],
      [
        "human",
        `Generate 4-6 professional, ATS-friendly bullet points for a resume describing work experience as a ${jobTitle} at ${company}.

${existingDescription ? `Context: ${existingDescription}\n\n` : ""}
Requirements:
- Start each bullet point with a strong action verb
- Include quantifiable achievements when possible (use realistic percentages and numbers)
- Focus on impact and results, not just responsibilities
- Make them specific and relevant to the role
- Keep each bullet point concise (1-2 lines)
- Use past tense for completed work
- Make them ATS-friendly (avoid special characters, use standard formatting)

Format: Return only the bullet points, one per line, starting with a bullet symbol (•).`,
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
    const stream = await chain.stream({});

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
              await incrementAIUsage("generate_bullets", userId).catch(console.error);
            }
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
    return handleApiError(error);
  }
}
