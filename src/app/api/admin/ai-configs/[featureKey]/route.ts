import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAIConfig, updateAIConfig } from "@/lib/admin/ai-config.service";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateAIConfigSchema = z.object({
  featureName: z.string().min(1).optional(),
  category: z.enum(["toolbox", "resume", "mock-interview", "other"]).optional(),
  systemPrompt: z.string().min(1).optional(),
  userPrompt: z.string().nullable().optional(),
  outputFormat: z.enum(["text", "json", "json-array", "stream"]).optional(),
  jsonSchema: z.string().nullable().optional(),
  promptValidationRules: z.array(z.string()).optional(),
  defaultModel: z.string().optional(),
  availableModels: z.array(z.string()).optional(),
  defaultTemperature: z.number().min(0).max(2).optional(),
  defaultMaxTokens: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
}).refine(
  (data) => {
    // If outputFormat is being changed to json/json-array, ensure jsonSchema is provided or exists
    if (data.outputFormat === "json" || data.outputFormat === "json-array") {
      return true; // We'll validate in service layer
    }
    return true;
  },
  { message: "JSON schema required for JSON output formats" }
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ featureKey: string }> }
): Promise<NextResponse> {
  try {
    await requireAdmin();
    const { featureKey } = await params;
    
    const config = await getAIConfig(featureKey);
    
    if (!config) {
      return NextResponse.json(
        { error: "AI config not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(config);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );
    
    return response;
  } catch (error: any) {
    console.error("Error fetching AI config:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch AI config" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ featureKey: string }> }
): Promise<NextResponse> {
  try {
    await requireAdmin();
    const { featureKey } = await params;
    const body = await request.json();
    
    const validated = updateAIConfigSchema.parse(body);
    
    // Note: mandatoryInstructions should not be directly updatable via API
    // They are auto-generated based on outputFormat
    // Admins can only view them
    
    const updated = await updateAIConfig(featureKey, validated);
    
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating AI config:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update AI config" },
      { status: error.statusCode || 500 }
    );
  }
}
