import { NextResponse } from "next/server";
import { getAppConfig } from "@/lib/admin/config.service";

export const revalidate = 60;

export async function GET(): Promise<NextResponse> {
  try {
    const config = await getAppConfig();
    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch config" },
      { status: 500 }
    );
  }
}
