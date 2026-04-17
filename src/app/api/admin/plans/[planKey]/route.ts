import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getSubscriptionPlanByKey } from "@/lib/admin/plans.service";
import { SubscriptionPlan } from "@/lib/subscription-plans";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planKey: string }> }
) {
  try {
    await requireAdmin();
    
    const { planKey } = await params;
    
    if (!["free", "freshers", "experience"].includes(planKey)) {
      return NextResponse.json(
        { error: "Invalid plan key" },
        { status: 400 }
      );
    }

    const plan = await getSubscriptionPlanByKey(planKey as SubscriptionPlan);

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(plan);
    
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch plan" },
      { status: 500 }
    );
  }
}
