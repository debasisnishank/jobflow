"use strict";

import "server-only";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/utils/user.utils";
import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";
import { AuthenticationError } from "@/lib/errors";
import { getSubscriptionPlans } from "@/lib/admin/plans.service";
import { getTotalAIRequestUsage } from "@/utils/usage-tracking";

async function getPlanConfig(plan: SubscriptionPlan): Promise<SubscriptionPlanConfig> {
  const allPlans = await getSubscriptionPlans();
  return allPlans[plan];
}

// Re-export only validation functions from feature-validation that are not defined here
export {
  validateAIToolboxUsage,
  validateResumeReviewUsage,
  validateJobMatchingUsage,
  validateCoverLetterUsage,
  validateMockInterviewUsage,
} from "./feature-validation";

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
 * Validate if user can make an AI request
 * Note: This requires tracking AI requests which needs to be implemented
 */
export async function validateAIRequest(): Promise<{ allowed: boolean; message?: string }> {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    return { allowed: true };
  }

  if (!user) {
    return { allowed: false, message: "Authentication required" };
  }

  const plan = await getUserPlan();
  const planConfig = await getPlanConfig(plan);

  if (planConfig.limits.aiRequestsPerMonth === -1) {
    return { allowed: true };
  }

  const currentCount = await getTotalAIRequestUsage(user.id);

  if (planConfig.limits.aiRequestsPerMonth !== -1 && currentCount >= planConfig.limits.aiRequestsPerMonth) {
    return {
      allowed: false,
      message: `You have reached the maximum limit of ${planConfig.limits.aiRequestsPerMonth} AI request(s) per month for your ${planConfig.name} plan. Please upgrade for more AI requests.`,
    };
  }

  return { allowed: true };
}

















