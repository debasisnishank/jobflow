import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { updateSubscriptionPlan } from "@/lib/admin/plans.service";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { clearPlansCache } from "@/lib/admin/plans.service";

export const dynamic = "force-dynamic";

const defaultPlans: Record<SubscriptionPlan, {
  name: string;
  price: number;
  limits: {
    jobs: number;
    resumes: number;
    storageMB: number;
    teamMembers: number;
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
    aiRequestsPerMonth: number;
  };
}> = {
  free: {
    name: "Free",
    price: 0,
    limits: {
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
    },
  },
  freshers: {
    name: "Freshers",
    price: 29,
    limits: {
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
    },
  },
  experience: {
    name: "Experience",
    price: 99,
    limits: {
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
    },
  },
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    
    const results = [];
    const errors = [];
    
    for (const [planKey, planData] of Object.entries(defaultPlans)) {
      try {
        await updateSubscriptionPlan(planKey as SubscriptionPlan, planData);
        results.push({ planKey, status: "created" });
      } catch (error: any) {
        errors.push({ planKey, error: error.message });
      }
    }
    
    clearPlansCache();
    
    return NextResponse.json({
      success: true,
      created: results.filter(r => r.status === "created").length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error seeding pricing plans:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed pricing plans" },
      { status: 500 }
    );
  }
}
