/**
 * Centralized Feature Access Control System
 * 
 * This module provides a unified way to:
 * 1. Check if users have access to features based on their subscription plan
 * 2. Validate usage limits before allowing feature access
 * 3. Track and deduct credits automatically after feature use
 * 
 * Usage in API routes:
 * ```typescript
 * import { validateFeatureAccess, FeatureType } from '@/lib/feature-access-control';
 * 
 * // In your API route
 * const validation = await validateFeatureAccess(FeatureType.AI_TOOLBOX, 'personal-brand-statement');
 * if (!validation.allowed) {
 *   return NextResponse.json({ error: validation.message }, { status: 403 });
 * }
 * 
 * // ... perform feature operation ...
 * // Credits are automatically deducted when you save history
 * ```
 */

import { NextResponse } from "next/server";
import {
  validateAIToolboxUsage,
  validateResumeReviewUsage,
  validateJobMatchingUsage,
  validateCoverLetterUsage,
  validateMockInterviewUsage,
  validateResumeCreation,
  validateStorageUpload,
  validateJobApplication,
  getUserPlan,
} from "@/lib/feature-validation";
import { SubscriptionPlanConfig } from "@/lib/subscription-plans";
import { getSubscriptionPlans } from "@/lib/admin/plans.service";

/**
 * Feature types for access control
 */
export enum FeatureType {
  // AI Toolbox features
  AI_TOOLBOX = "ai_toolbox",
  
  // AI Resume features
  AI_RESUME_REVIEW = "ai_resume_review",
  AI_JOB_MATCHING = "ai_job_matching",
  AI_COVER_LETTER = "ai_cover_letter",
  
  // Mock Interview
  MOCK_INTERVIEW = "mock_interview",
  
  // Core features
  RESUME_CREATION = "resume_creation",
  STORAGE_UPLOAD = "storage_upload",
  JOB_APPLICATION = "job_application",
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  allowed: boolean;
  message?: string;
  remaining?: number;
  planName?: string;
  limit?: number;
  currentUsage?: number;
}

/**
 * Main validation function - validates access to any feature
 * 
 * @param featureType - The type of feature to validate
 * @param additionalParams - Additional parameters needed for specific features
 * @returns ValidationResult with access status and details
 */
export async function validateFeatureAccess(
  featureType: FeatureType,
  additionalParams?: any
): Promise<ValidationResult> {
  try {
    let result: ValidationResult;

    switch (featureType) {
      case FeatureType.AI_TOOLBOX:
        if (!additionalParams || typeof additionalParams !== "string") {
          throw new Error("AI Toolbox validation requires toolType parameter");
        }
        const toolResult = await validateAIToolboxUsage(additionalParams);
        result = { ...toolResult, planName: (await getUserPlan()) };
        break;

      case FeatureType.AI_RESUME_REVIEW:
        result = await validateResumeReviewUsage();
        break;

      case FeatureType.AI_JOB_MATCHING:
        result = await validateJobMatchingUsage();
        break;

      case FeatureType.AI_COVER_LETTER:
        result = await validateCoverLetterUsage();
        break;

      case FeatureType.MOCK_INTERVIEW:
        result = await validateMockInterviewUsage();
        break;

      case FeatureType.RESUME_CREATION:
        result = await validateResumeCreation();
        break;

      case FeatureType.STORAGE_UPLOAD:
        if (typeof additionalParams !== "number") {
          throw new Error("Storage upload validation requires file size in bytes");
        }
        result = await validateStorageUpload(additionalParams);
        break;

      case FeatureType.JOB_APPLICATION:
        result = await validateJobApplication(additionalParams?.isCurrentlyApplied);
        break;

      default:
        result = {
          allowed: false,
          message: "Unknown feature type",
        };
    }

    return result;
  } catch (error) {
    console.error("Feature validation error:", error);
    return {
      allowed: false,
      message: error instanceof Error ? error.message : "Validation failed",
    };
  }
}

/**
 * Create a standardized error response for feature access denial
 */
export function createAccessDeniedResponse(
  validation: ValidationResult,
  upgradeUrl: string = "/pricing"
): NextResponse {
  return NextResponse.json(
    {
      error: validation.message || "Access denied",
      code: "FEATURE_LIMIT_REACHED",
      remaining: validation.remaining,
      planName: validation.planName,
      upgradeUrl,
    },
    { status: 403 }
  );
}

/**
 * Higher-order function to protect API routes with feature validation
 * 
 * Usage:
 * ```typescript
 * export const POST = withFeatureProtection(
 *   FeatureType.AI_TOOLBOX,
 *   async (req, validation) => {
 *     // Your route logic here
 *     // validation.remaining contains remaining credits
 *   },
 *   (req) => 'personal-brand-statement' // Optional: get params from request
 * );
 * ```
 */
export function withFeatureProtection(
  featureType: FeatureType,
  handler: (req: Request, validation: ValidationResult) => Promise<Response>,
  getParams?: (req: Request) => any
) {
  return async (req: Request): Promise<Response> => {
    try {
      // Get additional params if needed
      const params = getParams ? getParams(req) : undefined;

      // Validate access
      const validation = await validateFeatureAccess(featureType, params);

      if (!validation.allowed) {
        return createAccessDeniedResponse(validation);
      }

      // Execute handler with validation result
      return await handler(req, validation);
    } catch (error) {
      console.error("Feature protection error:", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Get user's current plan information with all limits
 */
export async function getUserPlanInfo() {
  const plan = await getUserPlan();
  const allPlans = await getSubscriptionPlans();
  const planConfig = allPlans[plan];

  return {
    plan,
    planName: planConfig.name,
    price: planConfig.price,
    limits: planConfig.limits,
  };
}

/**
 * Check if a feature is available on user's current plan
 */
export async function isFeatureAvailable(
  featureType: FeatureType,
  additionalParams?: any
): Promise<boolean> {
  const validation = await validateFeatureAccess(featureType, additionalParams);
  return validation.allowed;
}

/**
 * Get remaining credits for a specific feature
 */
export async function getRemainingCredits(
  featureType: FeatureType,
  additionalParams?: any
): Promise<number | null> {
  const validation = await validateFeatureAccess(featureType, additionalParams);
  return validation.remaining ?? null;
}

/**
 * Batch validate multiple features at once
 * Useful for dashboard/UI to show all available features
 */
export async function batchValidateFeatures(
  features: Array<{ type: FeatureType; params?: any }>
): Promise<Record<string, ValidationResult>> {
  const results: Record<string, ValidationResult> = {};

  await Promise.all(
    features.map(async (feature) => {
      const key = feature.params
        ? `${feature.type}:${feature.params}`
        : feature.type;
      results[key] = await validateFeatureAccess(feature.type, feature.params);
    })
  );

  return results;
}

/**
 * Middleware helper for Next.js API routes
 * Checks feature access before proceeding
 */
export async function checkFeatureAccess(
  featureType: FeatureType,
  params?: any
): Promise<{ success: true } | { success: false; response: NextResponse }> {
  const validation = await validateFeatureAccess(featureType, params);

  if (!validation.allowed) {
    return {
      success: false,
      response: createAccessDeniedResponse(validation),
    };
  }

  return { success: true };
}

/**
 * Helper to format feature limits for display
 */
export function formatLimit(limit: number): string {
  if (limit === -1) return "Unlimited";
  if (limit === 0) return "Not Available";
  return limit.toString();
}

/**
 * Helper to format remaining credits message
 */
export function formatRemainingMessage(
  remaining: number | null | undefined,
  featureName: string
): string {
  if (remaining === null || remaining === undefined) {
    return `${featureName}: Unlimited`;
  }
  if (remaining === 0) {
    return `${featureName}: No credits remaining`;
  }
  return `${featureName}: ${remaining} credit${remaining !== 1 ? 's' : ''} remaining`;
}
