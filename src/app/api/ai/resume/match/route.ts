import "server-only";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Resume } from "@/models/profile.model";
import { getJobMatchByOpenAi } from "@/actions/ai.actions";
import { getResumeById } from "@/actions/profile.actions";
import { getJobDetails } from "@/actions/job.actions";
import { AiModel } from "@/models/ai.model";
import { JobResponse } from "@/models/job.model";
import { ExternalServiceError, ValidationError } from "@/lib/errors";
import { validateFeatureAccess, FeatureType, createAccessDeniedResponse } from "@/lib/feature-access-control";
import { handleApiError, requireAuth } from "@/lib/api-error-handler";
import { incrementAIUsage } from "@/lib/ai-usage";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const session = await auth();
  const authError = requireAuth(session);
  if (authError) return authError;

  // Validate job matching access
  const validation = await validateFeatureAccess(FeatureType.AI_JOB_MATCHING);
  if (!validation.allowed) {
    return createAccessDeniedResponse(validation);
  }

  const { resumeId, jobId, selectedModel } = (await req.json()) as {
    resumeId: string;
    jobId: string;
    selectedModel: AiModel;
  };

  try {
    if (!resumeId || !jobId || !selectedModel) {
      throw new ValidationError(
        "ResumeId, Job Id and selectedModel is required",
        {
          context: {
            hasResumeId: !!resumeId,
            hasJobId: !!jobId,
            hasSelectedModel: !!selectedModel,
          },
        }
      );
    }

    const [resume, jobDetails] = await Promise.all([
      getResumeById(resumeId),
      getJobDetails(jobId),
    ]);

    if (!jobDetails.success || !jobDetails.job) {
      throw new ValidationError("Job not found", {
        context: { jobId },
      });
    }

    const job = jobDetails.job;

    // Validate AI request limit
    const { validateAIRequest } = await import("@/lib/plan-validation");
    const aiValidation = await validateAIRequest();
    if (!aiValidation.allowed) {
      throw new ValidationError(aiValidation.message || "AI request limit reached", {
        context: { function: "AI Job Match" },
      });
    }

    const response = await getJobMatchByOpenAi(resume, job, selectedModel.model);

    if (!response) {
      throw new ExternalServiceError("Failed to get AI response", {
        context: { provider: selectedModel.provider },
      });
    }

    // Track usage
    if (session?.accessToken?.sub) {
      await incrementAIUsage("job_match", session.accessToken.sub);
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
