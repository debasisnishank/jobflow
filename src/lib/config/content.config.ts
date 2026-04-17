import { appConfig } from "./app.config";
import { SUBSCRIPTION_PLANS } from "../subscription-plans";

/**
 * Centralized content configuration for frontend static data
 * Makes content dynamic and configurable
 */

// Get free plan limits for FAQ content
const freePlan = SUBSCRIPTION_PLANS.free;

export const contentConfig = {
  // FAQ Content - Dynamic based on plans
  faq: {
    freePlanJobs: freePlan.limits.jobs === -1 ? "Unlimited" : freePlan.limits.jobs,
    freePlanResumes: freePlan.limits.resumes === -1 ? "Unlimited" : freePlan.limits.resumes,
    freeTrialDays: 14,
    refundDays: 30,
    supportResponseHours: "24-48",
  },

  // About Page Stats (can be made dynamic via env vars in future)
  stats: {
    activeUsers: process.env.NEXT_PUBLIC_STAT_ACTIVE_USERS || "10K+",
    jobApplicationsTracked: process.env.NEXT_PUBLIC_STAT_JOB_APPLICATIONS || "500K+",
    resumesAnalyzed: process.env.NEXT_PUBLIC_STAT_RESUMES_ANALYZED || "100K+",
    successStories: process.env.NEXT_PUBLIC_STAT_SUCCESS_STORIES || "5K+",
  },

  // About Page Values
  values: [
    {
      icon: "Target",
      title: "Mission-Driven",
      description: "We're committed to helping job seekers succeed in their career journey by providing powerful, accessible tools.",
    },
    {
      icon: "Users",
      title: "User-Centric",
      description: "Every feature we build is designed with our users in mind. Your success is our success.",
    },
    {
      icon: "Zap",
      title: "Innovation",
      description: "We leverage cutting-edge AI technology to provide insights and tools that give you a competitive edge.",
    },
    {
      icon: "Shield",
      title: "Privacy First",
      description: "Your data belongs to you. We're self-hosted and committed to protecting your privacy and security.",
    },
  ],

  // Support information
  support: {
    email: appConfig.supportEmail,
    responseTime: "24-48 hours",
    priorityResponseTime: "Faster response times",
  },
};
