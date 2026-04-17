import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAppConfig, updateAppConfig } from "@/lib/admin/config.service";
import { z } from "zod";

const configSchema = z.object({
  appName: z.string().min(1).optional(),
  brandName: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  logoPath: z.string().optional(),
  gradientStart: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  gradientEnd: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  supportEmail: z.string().email().optional(),
  faviconPath: z.string().nullable().optional(),
  faviconLetter: z.string().length(1).optional(),
  faviconFontSize: z.string().optional(),
  faviconBorderRadius: z.string().optional(),
  faviconTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    const config = await getAppConfig();
    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch config" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    const body = await req.json();
    const validated = configSchema.parse(body);
    const updated = await updateAppConfig(validated);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update config" },
      { status: error.statusCode || 500 }
    );
  }
}
