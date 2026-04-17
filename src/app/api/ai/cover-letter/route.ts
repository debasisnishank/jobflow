import "server-only";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Resume } from "@/models/profile.model";
import { JobResponse } from "@/models/job.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { generateCoverLetterByOpenAI } from "@/actions/ai.actions";
import { getResumeById } from "@/actions/profile.actions";
import { getJobDetails } from "@/actions/job.actions";
import { getCoverLetterTemplates } from "@/actions/coverLetter.actions";
import { ExternalServiceError, ValidationError } from "@/lib/errors";
import { validateFeatureAccess, FeatureType, createAccessDeniedResponse } from "@/lib/feature-access-control";
import { handleApiError, requireAuth } from "@/lib/api-error-handler";
import { incrementAIUsage } from "@/lib/ai-usage";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const session = await auth();
  const authError = requireAuth(session);
  if (authError) return authError;

  // Validate cover letter generation access
  const validation = await validateFeatureAccess(FeatureType.AI_COVER_LETTER);
  if (!validation.allowed) {
    return createAccessDeniedResponse(validation);
  }

  let resumeId: string;
  let jobId: string;
  let templateId: string | undefined;
  let model: string | undefined;

  try {
    const body = await req.json();
    resumeId = body.resumeId;
    jobId = body.jobId;
    templateId = body.templateId;
    model = body.model;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body. Please ensure the request contains valid JSON." },
      { status: 400 }
    );
  }

  try {
    if (!resumeId || !jobId) {
      throw new ValidationError("ResumeId and JobId are required", {
        context: {
          hasResumeId: !!resumeId,
          hasJobId: !!jobId,
        },
      });
    }

    const [resume, jobResult] = await Promise.all([
      getResumeById(resumeId),
      getJobDetails(jobId),
    ]);

    if (!resume) {
      throw new ValidationError("Resume not found", {
        context: { resumeId },
      });
    }

    if (!jobResult.success || !jobResult.job) {
      throw new ValidationError("Job not found", {
        context: { jobId },
      });
    }

    const job = jobResult.job;
    let template: CoverLetterTemplate | undefined;

    // Try to load template if templateId is provided, but don't fail if it doesn't exist
    if (templateId) {
      try {
        const templatesResult = await getCoverLetterTemplates();
        if (templatesResult?.success && templatesResult.templates) {
          template = templatesResult.templates.find((t) => t.id === templateId);
        }
      } catch (error) {
        // Template loading failed, but we can still generate without it
        // Continue without template
      }
    }

    // Ensure OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      throw new ExternalServiceError(
        "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.",
        { context: { provider: "OpenAI" } }
      );
    }

    // Use OpenAI model - default to gpt-4o-mini if not specified
    const openAiModel = model || "gpt-4o-mini";

    const response = await generateCoverLetterByOpenAI(
      resume,
      job,
      template,
      openAiModel
    );

    if (!response) {
      throw new ExternalServiceError("Failed to generate cover letter", {
        context: { provider: "OpenAI" },
      });
    }

    // Track usage
    const userId = session?.accessToken?.sub;
    if (userId) {
      await incrementAIUsage("cover_letter", userId);
    }

    return new NextResponse(response, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
};

