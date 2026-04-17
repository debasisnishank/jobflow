"use strict";
import "server-only";

import { auth } from "@/auth";
import { getResumeReviewByOpenAi } from "@/actions/ai.actions";
import { NextRequest, NextResponse } from "next/server";
import { Resume } from "@/models/profile.model";
import { AiModel } from "@/models/ai.model";
import { ExternalServiceError, ValidationError } from "@/lib/errors";
import { validateFeatureAccess, FeatureType, createAccessDeniedResponse } from "@/lib/feature-access-control";
import { incrementAIUsage } from "@/lib/ai-usage";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const session = await auth();

  if (!session || !session.user || !session.accessToken) {
    return NextResponse.json(
      { error: "Not Authenticated" },
      { status: 401 }
    );
  }

  // Validate resume review access
  const validation = await validateFeatureAccess(FeatureType.AI_RESUME_REVIEW);
  if (!validation.allowed) {
    return createAccessDeniedResponse(validation);
  }

  const userId = session.accessToken.sub;
  const { selectedModel, resume } = (await req.json()) as {
    selectedModel: AiModel;
    resume: Resume;
  };
  try {
    if (!resume || !selectedModel) {
      throw new ValidationError("Resume or selected model is required", {
        context: { hasResume: !!resume, hasSelectedModel: !!selectedModel },
      });
    }

    // Fetch full resume with all relations from database
    const prisma = (await import("@/lib/db")).default;
    const fullResume = await prisma.resume.findUnique({
      where: { id: resume.id },
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
            licenseOrCertifications: true,
          },
        },
      },
    });

    if (!fullResume) {
      throw new ValidationError("Resume not found", {
        context: { resumeId: resume.id },
      });
    }

    const response = await getResumeReviewByOpenAi(fullResume as any, selectedModel.model);

    if (!response) {
      throw new ExternalServiceError("Failed to get AI response", {
        context: { provider: selectedModel.provider },
      });
    }

    // Track usage
    if (userId) {
      await incrementAIUsage("resume_review", userId);
    }

    return new NextResponse(response, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.log(error)
    if (error instanceof ExternalServiceError || error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const wrappedError =
      error instanceof Error
        ? new ExternalServiceError(
          error.message.includes("fetch")
            ? `Fetch failed, please make sure selected AI provider (${selectedModel?.provider || "unknown"}) service is running.`
            : "Error getting AI response.",
          {
            context: { provider: selectedModel?.provider },
            originalError: error,
          }
        )
        : new ExternalServiceError("Error getting AI response.", {
          context: { provider: selectedModel?.provider },
        });

    return NextResponse.json(
      { error: wrappedError.message },
      { status: wrappedError.statusCode }
    );
  }
};
