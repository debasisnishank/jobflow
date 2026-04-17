import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getSubscriptionPlans, updateSubscriptionPlan } from "@/lib/admin/plans.service";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const planUpdateSchema = z.object({
  planKey: z.enum(["free", "freshers", "experience"]),
  name: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  razorpayPlanId: z.string().optional(),
  limits: z.object({
    jobs: z.number().optional(),
    resumes: z.number().optional(),
    storageMB: z.number().optional(),
    teamMembers: z.number().optional(),
    aiToolboxPersonalBrand: z.number().optional(),
    aiToolboxEmailWriter: z.number().optional(),
    aiToolboxElevatorPitch: z.number().optional(),
    aiToolboxLinkedInHeadline: z.number().optional(),
    aiToolboxLinkedInAbout: z.number().optional(),
    aiToolboxLinkedInPost: z.number().optional(),
    aiResumeReview: z.number().optional(),
    aiJobMatching: z.number().optional(),
    aiCoverLetter: z.number().optional(),
    mockInterviews: z.number().optional(),
    aiRequestsPerMonth: z.number().optional(),
  }).optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    const plans = await getSubscriptionPlans();
    return NextResponse.json(plans);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch plans" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    const body = await req.json();
    const validated = planUpdateSchema.parse(body);
    
    const updated = await updateSubscriptionPlan(
      validated.planKey as SubscriptionPlan,
      {
        name: validated.name,
        price: validated.price,
        razorpayPlanId: validated.razorpayPlanId,
        limits: validated.limits,
      }
    );
    
    revalidateTag("subscription-plans");
    
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update plan" },
      { status: error.statusCode || 500 }
    );
  }
}
