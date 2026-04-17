import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllAIConfigs, createAIConfig } from "@/lib/admin/ai-config.service";
import { z } from "zod";

export const dynamic = "force-dynamic";

const aiConfigSchema = z.object({
  featureKey: z.string().min(1),
  featureName: z.string().min(1),
  category: z.enum(["toolbox", "resume", "mock-interview", "other"]),
  systemPrompt: z.string().min(1),
  mandatoryInstructions: z.string().nullable().optional(),
  userPrompt: z.string().nullable().optional(),
  outputFormat: z.enum(["text", "json", "json-array", "stream"]).default("text"),
  jsonSchema: z.string().nullable().optional(),
  requiresJsonFormat: z.boolean().optional(),
  promptValidationRules: z.array(z.string()).optional(),
  defaultModel: z.string().default("gpt-4o-mini"),
  availableModels: z.array(z.string()).default(["gpt-4o-mini", "gpt-4o-mini", "gpt-4"]),
  defaultTemperature: z.number().min(0).max(2).default(0.7),
  defaultMaxTokens: z.number().int().positive().default(1000),
  isActive: z.boolean().optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    const configs = await getAllAIConfigs();

    const response = NextResponse.json(configs);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching AI configs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch AI configs" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    const body = await req.json();
    const validated = aiConfigSchema.parse(body);

    const config = await createAIConfig(validated);

    return NextResponse.json(config, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating AI config:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create AI config" },
      { status: error.statusCode || 500 }
    );
  }
}
