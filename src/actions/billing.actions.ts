"use strict";

import "server-only";

import prisma from "@/lib/db";
import { AuthenticationError, DatabaseError } from "@/lib/errors";
import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";
import { getSubscriptionPlans } from "@/lib/admin/plans.service";
import { getCurrentUser } from "@/utils/user.utils";
import { getAllFeatureUsage, getTotalAIRequestUsage } from "@/utils/usage-tracking";

export interface UsageStatistics {
  jobsCount: number;
  resumesCount: number;
  aiRequestsCount: number;
  storageUsedMB: number;
  // Feature-specific usage
  aiToolboxPersonalBrand: number;
  aiToolboxEmailWriter: number;
  aiToolboxElevatorPitch: number;
  aiToolboxLinkedInHeadline: number;
  aiToolboxLinkedInAbout: number;
  aiToolboxLinkedInPost: number;
  aiResumeReview: number;
  aiJobMatching: number;
  aiCoverLetter: number;
  aiResumeParse: number;
  aiGenerateBullets: number;
  aiGenerateSummary: number;
  aiTailorResume: number;
  mockInterviews: number;
}

export interface PlanInfo {
  currentPlan: SubscriptionPlan;
  planName: string;
  planPrice: number;
  limits: {
    jobs: number;
    resumes: number;
    aiRequestsPerMonth: number;
    storageMB: number;
    teamMembers: number;
  };
}

export interface BillingInfo {
  planInfo: PlanInfo;
  usage: UsageStatistics;
  remaining: {
    jobs: number | null; // null means unlimited
    resumes: number | null;
    aiRequests: number | null;
    storageMB: number | null;
  };
}

export async function getBillingInfo(): Promise<BillingInfo> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated", {
      context: { function: "getBillingInfo" },
    });
  }

  try {
    // Get user's actual subscription plan from database
    // Note: If schema hasn't been pushed yet, subscriptionPlan field won't exist
    // In that case, we'll default to "free"
    let currentPlan: SubscriptionPlan = "free";
    try {
      const userRecord = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          subscriptionPlan: true,
        },
      });

      if (userRecord && (userRecord as any).subscriptionPlan) {
        currentPlan = (userRecord as any).subscriptionPlan as SubscriptionPlan;
        // Validate plan is one of the valid options
        if (!["free", "freshers", "experience"].includes(currentPlan)) {
          currentPlan = "free";
        }
      }
    } catch (schemaError) {
      // If field doesn't exist in database yet, default to free
      // Schema error handled silently - defaulting to free plan
      currentPlan = "free";
    }

    const allPlans = await getSubscriptionPlans();
    const planConfig = allPlans[currentPlan];

    // Optimize: Get usage statistics and file sizes in parallel
    const [jobsCount, resumesData] = await Promise.all([
      prisma.job.count({
        where: {
          userId: user.id,
          applied: true,
        },
      }),
      prisma.resume.findMany({
        where: {
          profile: {
            userId: user.id,
          },
        },
        select: {
          FileId: true,
        },
      }),
    ]);

    const resumesCount = resumesData.length;

    // Calculate storage used by all resume files
    // Get file IDs (filter out null values)
    const fileIds = resumesData
      .map((resume) => resume.FileId)
      .filter((id): id is string => id !== null && id !== undefined);

    // Query files if there are any file IDs (optimized: single query)
    let storageUsedBytes = 0;
    if (fileIds.length > 0) {
      try {
        const files = await prisma.file.findMany({
          where: {
            id: { in: fileIds },
          },
          select: {
            fileSize: true,
          },
        });

        storageUsedBytes = files.reduce((total, file) => {
          const size = file.fileSize ?? 0;
          return total + (size > 0 ? size : 0);
        }, 0);
      } catch (fileError) {
        // If file query fails, just set storage to 0 and continue
        storageUsedBytes = 0;
      }
    }

    // Convert bytes to MB and round to 2 decimal places
    const storageUsedMB = Math.round((storageUsedBytes / (1024 * 1024)) * 100) / 100;

    // Get all feature usage statistics
    const featureUsage = await getAllFeatureUsage(user.id);

    // Get total AI requests from the new AiUsage tracking table
    // This includes all AI features: parse, review, match, generate-bullets, generate-summary, tailor-for-job, cover-letter, etc.
    const aiRequestsCount = await getTotalAIRequestUsage(user.id);

    // Get individual usage counts from AiUsage table for new features
    const { getTrackedAIUsage } = await import("@/lib/ai-usage");
    const [aiResumeParse, aiGenerateBullets, aiGenerateSummary, aiTailorResume] = await Promise.all([
      getTrackedAIUsage("resume_parse", user.id),
      getTrackedAIUsage("generate_bullets", user.id),
      getTrackedAIUsage("generate_summary", user.id),
      getTrackedAIUsage("tailor_resume", user.id),
    ]);

    const usage: UsageStatistics = {
      jobsCount,
      resumesCount,
      aiRequestsCount,
      storageUsedMB,
      // Feature-specific usage
      aiToolboxPersonalBrand: featureUsage.aiToolboxPersonalBrand,
      aiToolboxEmailWriter: featureUsage.aiToolboxEmailWriter,
      aiToolboxElevatorPitch: featureUsage.aiToolboxElevatorPitch,
      aiToolboxLinkedInHeadline: featureUsage.aiToolboxLinkedInHeadline,
      aiToolboxLinkedInAbout: featureUsage.aiToolboxLinkedInAbout,
      aiToolboxLinkedInPost: featureUsage.aiToolboxLinkedInPost,
      aiResumeReview: featureUsage.aiResumeReview,
      aiJobMatching: featureUsage.aiJobMatching,
      aiCoverLetter: featureUsage.aiCoverLetter,
      // New AI features tracked in AiUsage table
      aiResumeParse,
      aiGenerateBullets,
      aiGenerateSummary,
      aiTailorResume,
      mockInterviews: featureUsage.mockInterviews,
    };

    // Calculate remaining limits
    const calculateRemaining = (used: number, limit: number): number | null => {
      if (limit === -1) return null; // unlimited
      return Math.max(0, limit - used);
    };

    const remaining = {
      jobs: calculateRemaining(jobsCount, planConfig.limits.jobs),
      resumes: calculateRemaining(resumesCount, planConfig.limits.resumes),
      aiRequests: calculateRemaining(aiRequestsCount, planConfig.limits.aiRequestsPerMonth),
      storageMB: calculateRemaining(storageUsedMB, planConfig.limits.storageMB),
    };

    return {
      planInfo: {
        currentPlan,
        planName: planConfig.name,
        planPrice: planConfig.price,
        limits: planConfig.limits,
      },
      usage,
      remaining,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    throw new DatabaseError("Failed to fetch billing information", {
      context: {
        userId: user.id,
        errorMessage,
        errorStack,
      },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

