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
      "linkedin-about"
    );

    if (!validation.allowed) {
      return createAccessDeniedResponse(validation);
    }

    const { targetJobTitle, keywords, resumeId } = await req.json();

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
            educations: {
              include: {
                location: true,
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
      resumeText += `Skills: ${resume.Skills.map((s) => s.name).join(", ")}\n`;
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { getAIConfigWithDefaults } = await import("@/lib/admin/ai-config-helper");
    const config = await getAIConfigWithDefaults("linkedin-about");

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", config.systemPrompt],
      [
        "human",
        `Based on this resume, create a LinkedIn About section:

{resumeData}`,
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
      targetJobTitle: targetJobTitle || "",
      keywords: keywords && keywords.length > 0 ? keywords.join(", ") : "",
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
  } catch (error: any) {
    console.error("Error generating LinkedIn About:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate LinkedIn About section" },
      { status: 500 }
    );
  }
}


