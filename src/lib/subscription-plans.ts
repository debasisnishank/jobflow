/**
 * Comprehensive subscription plan system with per-feature limits
 * All limits can be configured via environment variables
 */

export type SubscriptionPlan = "free" | "freshers" | "experience";

/**
 * Feature-specific limits interface
 */
export interface FeatureLimits {
  // Core features
  jobs: number; // -1 means unlimited
  resumes: number; // -1 means unlimited
  storageMB: number; // -1 means unlimited
  teamMembers: number; // -1 means unlimited
  
  // AI Toolbox features (per month)
  aiToolboxPersonalBrand: number; // Personal Brand Statement
  aiToolboxEmailWriter: number; // Email Writer
  aiToolboxElevatorPitch: number; // Elevator Pitch
  aiToolboxLinkedInHeadline: number; // LinkedIn Headline
  aiToolboxLinkedInAbout: number; // LinkedIn About
  aiToolboxLinkedInPost: number; // LinkedIn Post
  
  // AI Resume features (per month)
  aiResumeReview: number; // Resume Review
  aiJobMatching: number; // Job Matching
  aiCoverLetter: number; // Cover Letter Generation
  
  // Mock Interview features (per month)
  mockInterviews: number; // Mock Interview Sessions
  
  // Legacy: Total AI requests (for backward compatibility)
  aiRequestsPerMonth: number; // -1 means unlimited (sum of all AI features)
}

export interface SubscriptionPlanConfig {
  name: string;
  price: number;
  razorpayPlanId?: string;
  limits: FeatureLimits;
}

/**
 * Get environment variable as number, with fallback
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Build feature limits from environment variables or defaults
 */
function buildFeatureLimits(
  planKey: SubscriptionPlan,
  defaults: FeatureLimits
): FeatureLimits {
  const prefix = `PLAN_${planKey.toUpperCase()}_`;
  
  return {
    jobs: getEnvNumber(`${prefix}JOBS`, defaults.jobs),
    resumes: getEnvNumber(`${prefix}RESUMES`, defaults.resumes),
    storageMB: getEnvNumber(`${prefix}STORAGE_MB`, defaults.storageMB),
    teamMembers: getEnvNumber(`${prefix}TEAM_MEMBERS`, defaults.teamMembers),
    
    // AI Toolbox
    aiToolboxPersonalBrand: getEnvNumber(`${prefix}AI_TOOLBOX_PERSONAL_BRAND`, defaults.aiToolboxPersonalBrand),
    aiToolboxEmailWriter: getEnvNumber(`${prefix}AI_TOOLBOX_EMAIL_WRITER`, defaults.aiToolboxEmailWriter),
    aiToolboxElevatorPitch: getEnvNumber(`${prefix}AI_TOOLBOX_ELEVATOR_PITCH`, defaults.aiToolboxElevatorPitch),
    aiToolboxLinkedInHeadline: getEnvNumber(`${prefix}AI_TOOLBOX_LINKEDIN_HEADLINE`, defaults.aiToolboxLinkedInHeadline),
    aiToolboxLinkedInAbout: getEnvNumber(`${prefix}AI_TOOLBOX_LINKEDIN_ABOUT`, defaults.aiToolboxLinkedInAbout),
    aiToolboxLinkedInPost: getEnvNumber(`${prefix}AI_TOOLBOX_LINKEDIN_POST`, defaults.aiToolboxLinkedInPost),
    
    // AI Resume features
    aiResumeReview: getEnvNumber(`${prefix}AI_RESUME_REVIEW`, defaults.aiResumeReview),
    aiJobMatching: getEnvNumber(`${prefix}AI_JOB_MATCHING`, defaults.aiJobMatching),
    aiCoverLetter: getEnvNumber(`${prefix}AI_COVER_LETTER`, defaults.aiCoverLetter),
    
    // Mock Interviews
    mockInterviews: getEnvNumber(`${prefix}MOCK_INTERVIEWS`, defaults.mockInterviews),
    
    // Legacy: Calculate total AI requests (sum of all AI features, or -1 if unlimited)
    aiRequestsPerMonth: defaults.aiRequestsPerMonth,
  };
}

/**
 * Subscription Plans Configuration
 * All limits can be overridden via environment variables
 */
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionPlanConfig> = {
  free: {
    name: "Free",
    price: getEnvNumber("PLAN_FREE_PRICE", 0),
    limits: buildFeatureLimits("free", {
      // Core features
      jobs: 10,
      resumes: 1,
      storageMB: 5,
      teamMembers: 1,
      
      // AI Toolbox (per month)
      aiToolboxPersonalBrand: 2,
      aiToolboxEmailWriter: 2,
      aiToolboxElevatorPitch: 2,
      aiToolboxLinkedInHeadline: 3,
      aiToolboxLinkedInAbout: 2,
      aiToolboxLinkedInPost: 2,
      
      // AI Resume features (per month)
      aiResumeReview: 1,
      aiJobMatching: 2,
      aiCoverLetter: 1,
      
      // Mock Interviews (per month)
      mockInterviews: 0, // Not available on free plan
      
      // Legacy
      aiRequestsPerMonth: 5, // Total of all AI features
    }),
  },
  freshers: {
    name: "Freshers",
    price: getEnvNumber("PLAN_FRESHERS_PRICE", 29),
    limits: buildFeatureLimits("freshers", {
      // Core features
      jobs: 50,
      resumes: 5,
      storageMB: 20,
      teamMembers: 5,
      
      // AI Toolbox (per month)
      aiToolboxPersonalBrand: 10,
      aiToolboxEmailWriter: 15,
      aiToolboxElevatorPitch: 10,
      aiToolboxLinkedInHeadline: 20,
      aiToolboxLinkedInAbout: 10,
      aiToolboxLinkedInPost: 15,
      
      // AI Resume features (per month)
      aiResumeReview: 10,
      aiJobMatching: 25,
      aiCoverLetter: 10,
      
      // Mock Interviews (per month)
      mockInterviews: 5,
      
      // Legacy
      aiRequestsPerMonth: 50, // Total of all AI features
    }),
  },
  experience: {
    name: "Experience",
    price: getEnvNumber("PLAN_EXPERIENCE_PRICE", 99),
    limits: buildFeatureLimits("experience", {
      // Core features
      jobs: 500,
      resumes: 20,
      storageMB: 100,
      teamMembers: -1, // unlimited
      
      // AI Toolbox (per month) - unlimited
      aiToolboxPersonalBrand: -1,
      aiToolboxEmailWriter: -1,
      aiToolboxElevatorPitch: -1,
      aiToolboxLinkedInHeadline: -1,
      aiToolboxLinkedInAbout: -1,
      aiToolboxLinkedInPost: -1,
      
      // AI Resume features (per month) - unlimited
      aiResumeReview: -1,
      aiJobMatching: -1,
      aiCoverLetter: -1,
      
      // Mock Interviews (per month)
      mockInterviews: 50,
      
      // Legacy
      aiRequestsPerMonth: -1, // unlimited
    }),
  },
} as const;

/**
 * Get all AI toolbox tool types
 */
export const AI_TOOLBOX_TOOLS = [
  "personal-brand-statement",
  "email-writer",
  "elevator-pitch",
  "linkedin-headline",
  "linkedin-about",
  "linkedin-post",
] as const;

export type AIToolboxToolType = typeof AI_TOOLBOX_TOOLS[number];

/**
 * Map tool type to limit key
 */
export function getToolLimitKey(toolType: string): keyof FeatureLimits {
  const mapping: Record<string, keyof FeatureLimits> = {
    "personal-brand-statement": "aiToolboxPersonalBrand",
    "email-writer": "aiToolboxEmailWriter",
    "elevator-pitch": "aiToolboxElevatorPitch",
    "linkedin-headline": "aiToolboxLinkedInHeadline",
    "linkedin-about": "aiToolboxLinkedInAbout",
    "linkedin-post": "aiToolboxLinkedInPost",
  };
  
  return mapping[toolType] || "aiRequestsPerMonth";
}