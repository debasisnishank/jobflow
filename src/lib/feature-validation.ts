import "server-only";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/utils/user.utils";
import { SubscriptionPlan, SubscriptionPlanConfig, getToolLimitKey } from "@/lib/subscription-plans";
import { AuthenticationError } from "@/lib/errors";
import { getSubscriptionPlans } from "@/lib/admin/plans.service";
import {
  getAIToolboxUsage,
  getResumeReviewUsage,
  getJobMatchingUsage,
  getCoverLetterUsage,
  getMockInterviewUsage,
} from "@/utils/usage-tracking";

async function getPlanConfig(plan: SubscriptionPlan): Promise<SubscriptionPlanConfig> {
  const allPlans = await getSubscriptionPlans();
  return allPlans[plan];
}

/**
 * Get user's current subscription plan
 */
export async function getUserPlan(): Promise<SubscriptionPlan> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  try {
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
      select: { subscriptionPlan: true },
    });

    const currentPlan = (userRecord?.subscriptionPlan as SubscriptionPlan) || "free";
    
    // Validate plan is one of the valid options
    if (!["free", "freshers", "experience"].includes(currentPlan)) {
      return "free";
    }

    return currentPlan;
  } catch {
    return "free";
  }
}

/**
 * Validate if user can use a specific AI Toolbox tool
 */
export async function validateAIToolboxUsage(
  toolType: string
): Promise<{ allowed: boolean; message?: string; remaining?: number }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true, remaining: undefined };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);
  const limitKey = getToolLimitKey(toolType);
  const limit = planConfig.limits[limitKey];

  if (limit === -1) {
    return { allowed: true, remaining: undefined };
  }

  const currentUsage = await getAIToolboxUsage(toolType);
  const remaining = Math.max(0, limit - currentUsage);

  if (currentUsage >= limit) {
    const toolName = toolType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    return {
      allowed: false,
      message: `You have reached the monthly limit of ${limit} ${toolName} generation(s) for your ${planConfig.name} plan. Please upgrade for more AI toolbox features.`,
      remaining: 0,
    };
  }

  return { allowed: true, remaining };
}

/**
 * Validate if user can use Resume Review
 */
export async function validateResumeReviewUsage(): Promise<{ allowed: boolean; message?: string; remaining?: number }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true, remaining: undefined };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);
  const limit = planConfig.limits.aiResumeReview;

  if (limit === -1) {
    return { allowed: true, remaining: undefined };
  }

  const currentUsage = await getResumeReviewUsage();
  const remaining = Math.max(0, limit - currentUsage);

  if (currentUsage >= limit) {
    return {
      allowed: false,
      message: `You have reached the monthly limit of ${limit} resume review(s) for your ${planConfig.name} plan. Please upgrade for more AI resume reviews.`,
      remaining: 0,
    };
  }

  return { allowed: true, remaining };
}

/**
 * Validate if user can use Job Matching
 */
export async function validateJobMatchingUsage(): Promise<{ allowed: boolean; message?: string; remaining?: number }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true, remaining: undefined };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);
  const limit = planConfig.limits.aiJobMatching;

  if (limit === -1) {
    return { allowed: true, remaining: undefined };
  }

  const currentUsage = await getJobMatchingUsage();
  const remaining = Math.max(0, limit - currentUsage);

  if (currentUsage >= limit) {
    return {
      allowed: false,
      message: `You have reached the monthly limit of ${limit} job matching(s) for your ${planConfig.name} plan. Please upgrade for more AI job matching.`,
      remaining: 0,
    };
  }

  return { allowed: true, remaining };
}

/**
 * Validate if user can generate a Cover Letter
 */
export async function validateCoverLetterUsage(): Promise<{ allowed: boolean; message?: string; remaining?: number }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true, remaining: undefined };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);
  const limit = planConfig.limits.aiCoverLetter;

  if (limit === -1) {
    return { allowed: true, remaining: undefined };
  }

  const currentUsage = await getCoverLetterUsage();
  const remaining = Math.max(0, limit - currentUsage);

  if (currentUsage >= limit) {
    return {
      allowed: false,
      message: `You have reached the monthly limit of ${limit} cover letter(s) for your ${planConfig.name} plan. Please upgrade for more AI cover letter generation.`,
      remaining: 0,
    };
  }

  return { allowed: true, remaining };
}

/**
 * Validate if user can start a Mock Interview
 */
export async function validateMockInterviewUsage(): Promise<{ allowed: boolean; message?: string; remaining?: number }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true, remaining: undefined };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);
  const limit = planConfig.limits.mockInterviews;

  if (limit === -1) {
    return { allowed: true, remaining: undefined };
  }

  if (limit === 0) {
    return {
      allowed: false,
      message: `Mock Interviews are not available on the ${planConfig.name} plan. Please upgrade to access this feature.`,
      remaining: 0,
    };
  }

  const currentUsage = await getMockInterviewUsage();
  const remaining = Math.max(0, limit - currentUsage);

  if (currentUsage >= limit) {
    return {
      allowed: false,
      message: `You have reached the monthly limit of ${limit} mock interview(s) for your ${planConfig.name} plan. Please upgrade for more mock interviews.`,
      remaining: 0,
    };
  }

  return { allowed: true, remaining };
}

/**
 * Get user's current resume count
 */
export async function getResumeCount(): Promise<number> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  const profile = await prisma.profile.findFirst({
    where: { userId: user.id },
    include: { resumes: true },
  });

  return profile?.resumes.length || 0;
}

/**
 * Get user's current storage usage in MB
 */
export async function getStorageUsedMB(): Promise<number> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  const profile = await prisma.profile.findFirst({
    where: { userId: user.id },
    include: {
      resumes: {
        select: { FileId: true },
      },
    },
  });

  if (!profile) {
    return 0;
  }

  const fileIds = profile.resumes
    .map((r) => r.FileId)
    .filter((id): id is string => id !== null && id !== undefined);

  if (fileIds.length === 0) {
    return 0;
  }

  const files = await prisma.file.findMany({
    where: { id: { in: fileIds } },
    select: { fileSize: true },
  });

  const storageUsedBytes = files.reduce((total, file) => {
    const size = file.fileSize ?? 0;
    return total + (size > 0 ? size : 0);
  }, 0);

  // Convert bytes to MB
  return Math.round((storageUsedBytes / (1024 * 1024)) * 100) / 100;
}

/**
 * Get user's current jobs applied count
 */
export async function getJobsAppliedCount(): Promise<number> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  return prisma.job.count({
    where: {
      userId: user.id,
      applied: true,
    },
  });
}

/**
 * Validate if user can create a new resume
 */
export async function validateResumeCreation(): Promise<{ allowed: boolean; message?: string }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);
  const currentCount = await getResumeCount();

  if (planConfig.limits.resumes === -1) {
    return { allowed: true };
  }

  if (currentCount >= planConfig.limits.resumes) {
    return {
      allowed: false,
      message: `You have reached the maximum limit of ${planConfig.limits.resumes} resume(s) for your ${planConfig.name} plan. Please upgrade to create more resumes.`,
    };
  }

  return { allowed: true };
}

/**
 * Validate if user can upload file with given size
 */
export async function validateStorageUpload(fileSizeBytes: number): Promise<{ allowed: boolean; message?: string }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);
  const currentStorageMB = await getStorageUsedMB();
  const fileSizeMB = fileSizeBytes / (1024 * 1024);
  const totalAfterUpload = currentStorageMB + fileSizeMB;

  if (planConfig.limits.storageMB === -1) {
    return { allowed: true };
  }

  if (totalAfterUpload > planConfig.limits.storageMB) {
    const remainingMB = Math.max(0, planConfig.limits.storageMB - currentStorageMB);
    return {
      allowed: false,
      message: `Storage limit exceeded. Your ${planConfig.name} plan includes ${planConfig.limits.storageMB} MB storage. You have ${remainingMB.toFixed(2)} MB remaining. Please upgrade for more storage.`,
    };
  }

  return { allowed: true };
}

/**
 * Validate if user can mark a job as applied
 */
export async function validateJobApplication(isCurrentlyApplied: boolean = false): Promise<{ allowed: boolean; message?: string }> {
  if (isCurrentlyApplied) {
    return { allowed: true };
  }

  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);
  const currentCount = await getJobsAppliedCount();

  if (planConfig.limits.jobs === -1) {
    return { allowed: true };
  }

  if (currentCount >= planConfig.limits.jobs) {
    return {
      allowed: false,
      message: `You have reached the maximum limit of ${planConfig.limits.jobs} applied job(s) for your ${planConfig.name} plan. Please upgrade to apply to more jobs.`,
    };
  }

  return { allowed: true };
}

/**
 * Legacy: Validate if user can make an AI request (for backward compatibility)
 * This now uses the total AI requests limit
 */
export async function validateAIRequest(): Promise<{ allowed: boolean; message?: string }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);

  if (planConfig.limits.aiRequestsPerMonth === -1) {
    return { allowed: true };
  }

  return { allowed: true };
}
