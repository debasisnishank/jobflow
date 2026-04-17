"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/utils/user.utils";
import { AuthenticationError } from "@/lib/errors";
import { getCurrentPeriod } from "@/lib/ai-usage";

/**
 * Usage tracking utilities for all features
 */

/**
 * Get total usage of all AI features for the current month
 */
export async function getTotalAIRequestUsage(userId?: string): Promise<number> {
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const currentPeriod = getCurrentPeriod();

    const result = await prisma.aiUsage.aggregate({
      where: {
        userId: user.id,
        period: currentPeriod,
      },
      _sum: {
        count: true,
      },
    });

    return result._sum.count || 0;
  } catch (error) {
    console.error("Failed to get total AI usage:", error);
    return 0;
  }
}

import { getTrackedAIUsage } from "@/lib/ai-usage";

/**
 * Get AI Toolbox usage count for a specific tool in current month
 */
export async function getAIToolboxUsage(
  toolType: string,
  userId?: string
): Promise<number> {
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const count = await prisma.aIToolboxHistory.count({
      where: {
        userId: user.id,
        toolType: toolType,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return count;
  } catch (error) {
    console.error("Failed to get AI toolbox usage:", error);
    return 0;
  }
}

/**
 * Get total AI Toolbox usage across all tools in current month
 */
export async function getTotalAIToolboxUsage(userId?: string): Promise<number> {
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const count = await prisma.aIToolboxHistory.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return count;
  } catch (error) {
    console.error("Failed to get total AI toolbox usage:", error);
    return 0;
  }
}

/**
 * Get Resume Review usage count in current month
 */
export async function getResumeReviewUsage(userId?: string): Promise<number> {
  // We prioritize the explicit AiUsage tracking. 
  // If you want to fallback to 'lastOptimizedAt' for legacy reasons, you can mix them, 
  // but for now let's switch to the new accurate tracking.
  return getTrackedAIUsage("resume_review", userId);
}

/**
 * Get Job Matching usage count in current month
 */
export async function getJobMatchingUsage(userId?: string): Promise<number> {
  return getTrackedAIUsage("job_match", userId);
}

/**
 * Get Cover Letter generation usage count in current month
 */
export async function getCoverLetterUsage(userId?: string): Promise<number> {
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const count = await prisma.coverLetter.count({
      where: {
        job: {
          userId: user.id,
        },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return count;
  } catch (error) {
    console.error("Failed to get cover letter usage:", error);
    return 0;
  }
}

/**
 * Get Mock Interview usage count in current month
 */
export async function getMockInterviewUsage(userId?: string): Promise<number> {
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const count = await prisma.mockInterviewSession.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return count;
  } catch (error) {
    console.error("Failed to get mock interview usage:", error);
    return 0;
  }
}

/**
 * Get comprehensive usage statistics for all features
 */
export interface FeatureUsage {
  aiToolboxPersonalBrand: number;
  aiToolboxEmailWriter: number;
  aiToolboxElevatorPitch: number;
  aiToolboxLinkedInHeadline: number;
  aiToolboxLinkedInAbout: number;
  aiToolboxLinkedInPost: number;
  aiResumeReview: number;
  aiJobMatching: number;
  aiCoverLetter: number;
  mockInterviews: number;
  totalAIToolbox: number;
}

export async function getAllFeatureUsage(userId?: string): Promise<FeatureUsage> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Optimize: Use a single aggregated query for all AI Toolbox usage instead of 6 separate queries
  const aiToolboxUsage = await prisma.aIToolboxHistory.groupBy({
    by: ["toolType"],
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _count: {
      _all: true,
    },
  });

  // Create a map for quick lookup
  const usageMap: Record<string, number> = {};
  aiToolboxUsage.forEach((item) => {
    usageMap[item.toolType] = item._count._all;
  });

  // Get other feature usage in parallel (these are on different tables, so we can't aggregate them together)
  const [
    resumeReview,
    jobMatching,
    coverLetter,
    mockInterviews,
  ] = await Promise.all([
    getResumeReviewUsage(user.id),
    getJobMatchingUsage(user.id),
    getCoverLetterUsage(user.id),
    getMockInterviewUsage(user.id),
  ]);

  const personalBrand = usageMap["personal-brand-statement"] || 0;
  const emailWriter = usageMap["email-writer"] || 0;
  const elevatorPitch = usageMap["elevator-pitch"] || 0;
  const linkedInHeadline = usageMap["linkedin-headline"] || 0;
  const linkedInAbout = usageMap["linkedin-about"] || 0;
  const linkedInPost = usageMap["linkedin-post"] || 0;

  return {
    aiToolboxPersonalBrand: personalBrand,
    aiToolboxEmailWriter: emailWriter,
    aiToolboxElevatorPitch: elevatorPitch,
    aiToolboxLinkedInHeadline: linkedInHeadline,
    aiToolboxLinkedInAbout: linkedInAbout,
    aiToolboxLinkedInPost: linkedInPost,
    aiResumeReview: resumeReview,
    aiJobMatching: jobMatching,
    aiCoverLetter: coverLetter,
    mockInterviews: mockInterviews,
    totalAIToolbox: personalBrand + emailWriter + elevatorPitch + linkedInHeadline + linkedInAbout + linkedInPost,
  };
}
