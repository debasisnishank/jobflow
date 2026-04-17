import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getAdminStats } from "@/lib/admin/stats.service";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const durationParam = searchParams.get("duration") || "7";
    
    let duration: number | "all";
    if (durationParam === "all") {
      duration = "all";
    } else {
      duration = parseInt(durationParam, 10);
      if (![7, 30, 90].includes(duration)) {
        return NextResponse.json(
          { error: "Invalid duration. Must be 7, 30, 90, or 'all'." },
          { status: 400 }
        );
      }
    }

    const stats = await getAdminStats(duration);

    const response = NextResponse.json(stats);
    
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
