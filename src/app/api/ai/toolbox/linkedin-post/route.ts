import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getCurrentUser } from "@/utils/user.utils";
import prisma from "@/lib/db";
import { validateFeatureAccess, FeatureType, createAccessDeniedResponse } from "@/lib/feature-access-control";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate feature access and check usage limits
    const validation = await validateFeatureAccess(
      FeatureType.AI_TOOLBOX,
      "linkedin-post"
    );

    if (!validation.allowed) {
      return createAccessDeniedResponse(validation);
    }

    const {
      topic,
      description,
      useEmojis,
      useBulletPoints,
      useHashtags,
      tone,
      length,
      language,
      resumeId,
    } = await req.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch resume data
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
              },
            },
          },
        },
      },
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // Convert resume to text
    let resumeText = "";
    if (resume.ContactInfo) {
      resumeText += `Name: ${resume.ContactInfo.firstName} ${resume.ContactInfo.lastName}\n`;
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
        });
        resumeText += "\n";
      }
    });

    if (resume.Skills && resume.Skills.length > 0) {
      resumeText += `Skills: ${resume.Skills.map((s) => s.name).join(", ")}\n`;
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { getAIConfigWithDefaults } = await import("@/lib/admin/ai-config-helper");
    const config = await getAIConfigWithDefaults("linkedin-post");

    const lengthGuidance = {
      Short: "150-300 words",
      Medium: "300-600 words",
      Long: "600-1000 words",
    };

    const systemPrompt = `${config.systemPrompt}

Topic: {topic}
Description: {description}
Tone: {tone}
Length: {lengthGuidance} ({length})
Language: {language}
Use emojis: {useEmojis}
Use bullet points: {useBulletPoints}
Use hashtags: {useHashtags}

Guidelines:
- Start with a hook that grabs attention
- Provide value and insights
- Include personal experience when relevant
- End with a question or call-to-action
- Use appropriate formatting (paragraphs, line breaks)
- If hashtags requested, add 3-5 relevant hashtags at the end
- If bullet points requested, use them for key points
- If emojis requested, use them sparingly and appropriately
- Match the {tone} tone throughout

Return ONLY the post content with proper formatting.`;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      [
        "human",
        `Create a LinkedIn post based on this candidate's background:

{resumeData}`,
      ],
    ]);

    const dynamicMaxTokens = length === "Long" ? 2000 : length === "Medium" ? 1200 : 600;
    const maxTokens = Math.max(config.maxTokens, dynamicMaxTokens);

    const model = new ChatOpenAI({
      modelName: config.modelName,
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: config.temperature,
      streaming: true,
      maxTokens,
    });

    const chain = prompt.pipe(model as any).pipe(new StringOutputParser());

    const stream = await chain.stream({
      topic: topic || "",
      description: description || "",
      tone: tone || "Professional",
      lengthGuidance: lengthGuidance[length as keyof typeof lengthGuidance] || "300-600 words",
      length: length || "Medium",
      language: language || "English",
      useEmojis: useEmojis ? "Yes, use emojis appropriately" : "No, do not use emojis",
      useBulletPoints: useBulletPoints ? "Yes, use bullet points for key points" : "No, use paragraphs",
      useHashtags: useHashtags ? "Yes, add 3-5 relevant hashtags at the end" : "No, do not include hashtags",
      resumeData: resumeText,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate LinkedIn post";
    console.error("Error generating LinkedIn post:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


