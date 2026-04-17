import "server-only";
import prisma from "@/lib/db";
import { SubscriptionPlan, SubscriptionPlanConfig, FeatureLimits, SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

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
    aiToolboxPersonalBrand: getEnvNumber(`${prefix}AI_TOOLBOX_PERSONAL_BRAND`, defaults.aiToolboxPersonalBrand),
    aiToolboxEmailWriter: getEnvNumber(`${prefix}AI_TOOLBOX_EMAIL_WRITER`, defaults.aiToolboxEmailWriter),
    aiToolboxElevatorPitch: getEnvNumber(`${prefix}AI_TOOLBOX_ELEVATOR_PITCH`, defaults.aiToolboxElevatorPitch),
    aiToolboxLinkedInHeadline: getEnvNumber(`${prefix}AI_TOOLBOX_LINKEDIN_HEADLINE`, defaults.aiToolboxLinkedInHeadline),
    aiToolboxLinkedInAbout: getEnvNumber(`${prefix}AI_TOOLBOX_LINKEDIN_ABOUT`, defaults.aiToolboxLinkedInAbout),
    aiToolboxLinkedInPost: getEnvNumber(`${prefix}AI_TOOLBOX_LINKEDIN_POST`, defaults.aiToolboxLinkedInPost),
    aiResumeReview: getEnvNumber(`${prefix}AI_RESUME_REVIEW`, defaults.aiResumeReview),
    aiJobMatching: getEnvNumber(`${prefix}AI_JOB_MATCHING`, defaults.aiJobMatching),
    aiCoverLetter: getEnvNumber(`${prefix}AI_COVER_LETTER`, defaults.aiCoverLetter),
    mockInterviews: getEnvNumber(`${prefix}MOCK_INTERVIEWS`, defaults.mockInterviews),
    aiRequestsPerMonth: defaults.aiRequestsPerMonth,
  };
}

function dbPlanToConfig(plan: any): SubscriptionPlanConfig {
  const config: SubscriptionPlanConfig = {
    name: plan.name,
    price: plan.price,
    limits: {
      jobs: plan.jobs,
      resumes: plan.resumes,
      storageMB: plan.storageMB,
      teamMembers: plan.teamMembers,
      aiToolboxPersonalBrand: plan.aiToolboxPersonalBrand,
      aiToolboxEmailWriter: plan.aiToolboxEmailWriter,
      aiToolboxElevatorPitch: plan.aiToolboxElevatorPitch,
      aiToolboxLinkedInHeadline: plan.aiToolboxLinkedInHeadline,
      aiToolboxLinkedInAbout: plan.aiToolboxLinkedInAbout,
      aiToolboxLinkedInPost: plan.aiToolboxLinkedInPost,
      aiResumeReview: plan.aiResumeReview,
      aiJobMatching: plan.aiJobMatching,
      aiCoverLetter: plan.aiCoverLetter,
      mockInterviews: plan.mockInterviews,
      aiRequestsPerMonth: plan.aiRequestsPerMonth,
    },
  };
  
  if (plan.razorpayPlanId) {
    config.razorpayPlanId = plan.razorpayPlanId;
  }
  
  return config;
}

let cachedPlans: Record<SubscriptionPlan, SubscriptionPlanConfig> | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 300000;

export async function getSubscriptionPlans(): Promise<Record<SubscriptionPlan, SubscriptionPlanConfig>> {
  const now = Date.now();
  
  if (cachedPlans && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedPlans;
  }

  try {
    const dbPlans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
    });

    if (dbPlans.length > 0) {
      const plans: Partial<Record<SubscriptionPlan, SubscriptionPlanConfig>> = {};
      
      for (const plan of dbPlans) {
        if (["free", "freshers", "experience"].includes(plan.planKey)) {
          plans[plan.planKey as SubscriptionPlan] = dbPlanToConfig(plan);
        }
      }

      if (Object.keys(plans).length === 3) {
        cachedPlans = plans as Record<SubscriptionPlan, SubscriptionPlanConfig>;
        cacheTimestamp = now;
        return cachedPlans;
      }
    }
  } catch (error) {
    console.error("Error fetching subscription plans from database:", error);
  }

  const envPlans: Record<SubscriptionPlan, SubscriptionPlanConfig> = {
    free: {
      name: "Free",
      price: getEnvNumber("PLAN_FREE_PRICE", 0),
      limits: buildFeatureLimits("free", {
        jobs: 10,
        resumes: 1,
        storageMB: 5,
        teamMembers: 1,
        aiToolboxPersonalBrand: 2,
        aiToolboxEmailWriter: 2,
        aiToolboxElevatorPitch: 2,
        aiToolboxLinkedInHeadline: 3,
        aiToolboxLinkedInAbout: 2,
        aiToolboxLinkedInPost: 2,
        aiResumeReview: 1,
        aiJobMatching: 2,
        aiCoverLetter: 1,
        mockInterviews: 0,
        aiRequestsPerMonth: 5,
      }),
    },
    freshers: {
      name: "Freshers",
      price: getEnvNumber("PLAN_FRESHERS_PRICE", 29),
      limits: buildFeatureLimits("freshers", {
        jobs: 50,
        resumes: 5,
        storageMB: 20,
        teamMembers: 5,
        aiToolboxPersonalBrand: 10,
        aiToolboxEmailWriter: 15,
        aiToolboxElevatorPitch: 10,
        aiToolboxLinkedInHeadline: 20,
        aiToolboxLinkedInAbout: 10,
        aiToolboxLinkedInPost: 15,
        aiResumeReview: 10,
        aiJobMatching: 25,
        aiCoverLetter: 10,
        mockInterviews: 5,
        aiRequestsPerMonth: 50,
      }),
    },
    experience: {
      name: "Experience",
      price: getEnvNumber("PLAN_EXPERIENCE_PRICE", 99),
      limits: buildFeatureLimits("experience", {
        jobs: 500,
        resumes: 20,
        storageMB: 100,
        teamMembers: -1,
        aiToolboxPersonalBrand: -1,
        aiToolboxEmailWriter: -1,
        aiToolboxElevatorPitch: -1,
        aiToolboxLinkedInHeadline: -1,
        aiToolboxLinkedInAbout: -1,
        aiToolboxLinkedInPost: -1,
        aiResumeReview: -1,
        aiJobMatching: -1,
        aiCoverLetter: -1,
        mockInterviews: 50,
        aiRequestsPerMonth: -1,
      }),
    },
  };

  cachedPlans = envPlans;
  cacheTimestamp = now;
  return envPlans;
}

export async function updateSubscriptionPlan(
  planKey: SubscriptionPlan,
  config: Partial<Omit<SubscriptionPlanConfig, "limits">> & { limits?: Partial<FeatureLimits> }
): Promise<SubscriptionPlanConfig> {
  const existing = await prisma.subscriptionPlan.findUnique({
    where: { planKey },
  });

  const planData = {
    name: config.name ?? existing?.name ?? SUBSCRIPTION_PLANS[planKey].name,
    price: config.price ?? existing?.price ?? SUBSCRIPTION_PLANS[planKey].price,
    razorpayPlanId: config.razorpayPlanId ?? existing?.razorpayPlanId ?? null,
    isActive: true,
    jobs: config.limits?.jobs ?? existing?.jobs ?? SUBSCRIPTION_PLANS[planKey].limits.jobs,
    resumes: config.limits?.resumes ?? existing?.resumes ?? SUBSCRIPTION_PLANS[planKey].limits.resumes,
    storageMB: config.limits?.storageMB ?? existing?.storageMB ?? SUBSCRIPTION_PLANS[planKey].limits.storageMB,
    teamMembers: config.limits?.teamMembers ?? existing?.teamMembers ?? SUBSCRIPTION_PLANS[planKey].limits.teamMembers,
    aiToolboxPersonalBrand: config.limits?.aiToolboxPersonalBrand ?? existing?.aiToolboxPersonalBrand ?? SUBSCRIPTION_PLANS[planKey].limits.aiToolboxPersonalBrand,
    aiToolboxEmailWriter: config.limits?.aiToolboxEmailWriter ?? existing?.aiToolboxEmailWriter ?? SUBSCRIPTION_PLANS[planKey].limits.aiToolboxEmailWriter,
    aiToolboxElevatorPitch: config.limits?.aiToolboxElevatorPitch ?? existing?.aiToolboxElevatorPitch ?? SUBSCRIPTION_PLANS[planKey].limits.aiToolboxElevatorPitch,
    aiToolboxLinkedInHeadline: config.limits?.aiToolboxLinkedInHeadline ?? existing?.aiToolboxLinkedInHeadline ?? SUBSCRIPTION_PLANS[planKey].limits.aiToolboxLinkedInHeadline,
    aiToolboxLinkedInAbout: config.limits?.aiToolboxLinkedInAbout ?? existing?.aiToolboxLinkedInAbout ?? SUBSCRIPTION_PLANS[planKey].limits.aiToolboxLinkedInAbout,
    aiToolboxLinkedInPost: config.limits?.aiToolboxLinkedInPost ?? existing?.aiToolboxLinkedInPost ?? SUBSCRIPTION_PLANS[planKey].limits.aiToolboxLinkedInPost,
    aiResumeReview: config.limits?.aiResumeReview ?? existing?.aiResumeReview ?? SUBSCRIPTION_PLANS[planKey].limits.aiResumeReview,
    aiJobMatching: config.limits?.aiJobMatching ?? existing?.aiJobMatching ?? SUBSCRIPTION_PLANS[planKey].limits.aiJobMatching,
    aiCoverLetter: config.limits?.aiCoverLetter ?? existing?.aiCoverLetter ?? SUBSCRIPTION_PLANS[planKey].limits.aiCoverLetter,
    mockInterviews: config.limits?.mockInterviews ?? existing?.mockInterviews ?? SUBSCRIPTION_PLANS[planKey].limits.mockInterviews,
    aiRequestsPerMonth: config.limits?.aiRequestsPerMonth ?? existing?.aiRequestsPerMonth ?? SUBSCRIPTION_PLANS[planKey].limits.aiRequestsPerMonth,
  };

  if (existing) {
    const updated = await prisma.subscriptionPlan.update({
      where: { planKey },
      data: planData,
    });

    cachedPlans = null;
    cacheTimestamp = 0;
    return dbPlanToConfig(updated);
  } else {
    const created = await prisma.subscriptionPlan.create({
      data: {
        planKey,
        ...planData,
      },
    });

    cachedPlans = null;
    cacheTimestamp = 0;
    return dbPlanToConfig(created);
  }
}

export async function getSubscriptionPlanByKey(planKey: SubscriptionPlan): Promise<SubscriptionPlanConfig | null> {
  try {
    const dbPlan = await prisma.subscriptionPlan.findUnique({
      where: { planKey, isActive: true },
    });

    if (dbPlan) {
      return dbPlanToConfig(dbPlan);
    }
  } catch (error) {
    console.error(`Error fetching subscription plan ${planKey} from database:`, error);
  }

  return null;
}

export function clearPlansCache() {
  cachedPlans = null;
  cacheTimestamp = 0;
}
