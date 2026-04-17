import { NextResponse } from "next/server";
import { getSubscriptionPlans } from "@/lib/admin/plans.service";
import { unstable_cache } from "next/cache";

export const revalidate = 300;

const getCachedPlans = unstable_cache(
  async () => {
    return await getSubscriptionPlans();
  },
  ["subscription-plans"],
  {
    revalidate: 300,
    tags: ["subscription-plans"],
  }
);

export async function GET() {
  try {
    const plans = await getCachedPlans();
    
    return NextResponse.json(plans, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "CDN-Cache-Control": "public, s-maxage=300",
        "Vercel-CDN-Cache-Control": "public, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription plans" },
      { status: 500 }
    );
  }
}
