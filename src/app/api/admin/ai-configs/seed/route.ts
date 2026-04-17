import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createAIConfig } from "@/lib/admin/ai-config.service";
import { getDefaultMandatoryInstructions } from "@/lib/admin/ai-prompt-validation";
import { DEFAULT_AI_PROMPTS } from "@/lib/admin/ai-prompts-defaults";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const jsonSchemas: Record<string, string> = {
  "resume-review": JSON.stringify({
    summary: "string - brief summary of the resume review",
    strengths: "array of strings - list of strengths",
    weaknesses: "array of strings - list of weaknesses",
    suggestions: "array of strings - suggestions for improvement",
    score: "number 0-100 - strict scoring based on skills, ATS friendliness, formatting"
  }, null, 2),
  "resume-job-match": JSON.stringify({
    matching_score: "number 0-100",
    detailed_analysis: "array of {category: string, value: string[]}",
    suggestions: "array of {category: string, value: string[]}",
    additional_comments: "array of strings"
  }, null, 2),
  "mock-interview-questions": JSON.stringify([{
    question: "string - the interview question",
    questionType: "behavioral | technical | situational | case_study | system_design | other",
    order: "number"
  }], null, 2),
  "mock-interview-feedback": JSON.stringify({
    score: "number 0-100",
    strengths: "array of strings",
    suggestions: "array of strings",
    feedback: "string - detailed feedback paragraph"
  }, null, 2),
};

const categoryMap: Record<string, string> = {
  "personal-brand-statement": "toolbox",
  "email-writer": "toolbox",
  "elevator-pitch": "toolbox",
  "linkedin-headline": "toolbox",
  "linkedin-about": "toolbox",
  "linkedin-post": "toolbox",
  "resume-review": "resume",
  "resume-job-match": "resume",
  "resume-cover-letter": "resume",
  "resume-generate-summary": "resume",
  "resume-generate-bullets": "resume",
  "mock-interview-questions": "mock-interview",
  "mock-interview-feedback": "mock-interview",
  "ai-assistant": "other",
};

const nameMap: Record<string, string> = {
  "personal-brand-statement": "Personal Brand Statement",
  "email-writer": "Email Writer",
  "elevator-pitch": "Elevator Pitch",
  "linkedin-headline": "LinkedIn Headline",
  "linkedin-about": "LinkedIn About",
  "linkedin-post": "LinkedIn Post",
  "resume-review": "Resume Review",
  "resume-job-match": "Resume Job Match",
  "resume-cover-letter": "Cover Letter Generation",
  "resume-generate-summary": "Resume Summary Generation",
  "resume-generate-bullets": "Resume Bullet Points Generation",
  "mock-interview-questions": "Mock Interview Questions",
  "mock-interview-feedback": "Mock Interview Feedback",
  "ai-assistant": "AI Assistant",
};

const outputFormatMap: Record<string, "text" | "json" | "json-array" | "stream"> = {
  "personal-brand-statement": "text",
  "email-writer": "text",
  "elevator-pitch": "text",
  "linkedin-headline": "text",
  "linkedin-about": "text",
  "linkedin-post": "text",
  "resume-review": "json",
  "resume-job-match": "json",
  "resume-cover-letter": "text",
  "resume-generate-summary": "text",
  "resume-generate-bullets": "text",
  "mock-interview-questions": "json-array",
  "mock-interview-feedback": "json",
  "ai-assistant": "stream",
};

const promptValidationRulesMap: Record<string, string[]> = {
  "resume-review": ["must-contain-json", "must-contain-score"],
  "resume-job-match": ["must-contain-json", "must-contain-score"],
  "mock-interview-questions": ["must-contain-json"],
  "mock-interview-feedback": ["must-contain-json", "must-contain-score"],
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();

    const results = [];
    const errors = [];

    const defaultConfigs = Object.entries(DEFAULT_AI_PROMPTS).map(([featureKey, promptConfig]) => ({
      featureKey,
      featureName: nameMap[featureKey] || featureKey,
      category: categoryMap[featureKey] || "other",
      systemPrompt: promptConfig.systemPrompt,
      outputFormat: outputFormatMap[featureKey] || "text",
      jsonSchema: jsonSchemas[featureKey] || null,
      requiresJsonFormat: outputFormatMap[featureKey] === "json" || outputFormatMap[featureKey] === "json-array",
      promptValidationRules: promptValidationRulesMap[featureKey] || [],
      defaultModel: promptConfig.defaultModel,
      defaultTemperature: promptConfig.defaultTemperature,
      defaultMaxTokens: promptConfig.defaultMaxTokens,
    }));

    const allAvailableModels = [
      "gpt-5.2",
      "gpt-5.2-pro",
      "gpt-5",
      "gpt-5-mini",
      "gpt-5-nano",
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "o3",
      "o3-mini",
      "o3-pro",
      "o3-deep-research",
      "o4-mini",
      "o1",
      "o1-pro",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
    ];

    for (const config of defaultConfigs) {
      try {
        const existing = await prisma.aIConfig.findUnique({
          where: { featureKey: config.featureKey },
        });

        if (existing) {
          await prisma.aIConfig.update({
            where: { featureKey: config.featureKey },
            data: {
              availableModels: allAvailableModels,
            },
          });
          results.push({ featureKey: config.featureKey, status: "updated", reason: "Updated available models" });
          continue;
        }

        let mandatoryInstructions = null;
        if (config.outputFormat === "json" || config.outputFormat === "json-array") {
          mandatoryInstructions = getDefaultMandatoryInstructions(
            config.outputFormat,
            config.jsonSchema || null
          );
        }

        const created = await createAIConfig({
          ...config,
          availableModels: allAvailableModels,
          mandatoryInstructions,
          isActive: true,
        });

        results.push({ featureKey: config.featureKey, status: "created" });
      } catch (error: any) {
        errors.push({ featureKey: config.featureKey, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      created: results.filter(r => r.status === "created").length,
      updated: results.filter(r => r.status === "updated").length,
      skipped: results.filter(r => r.status === "skipped").length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error seeding AI configs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed AI configs" },
      { status: 500 }
    );
  }
}
