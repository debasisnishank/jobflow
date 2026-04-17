"use strict";
import "server-only";

import { unstable_cache } from "next/cache";
import prisma from "@/lib/db";
import {
  sanitizePrompt,
  validatePrompt,
  buildFinalPrompt,
  getDefaultMandatoryInstructions,
} from "./ai-prompt-validation";
import { revalidateTag } from "next/cache";

export interface AIConfigData {
  featureKey: string;
  featureName: string;
  category: string;
  systemPrompt: string;
  mandatoryInstructions?: string | null;
  userPrompt?: string | null;
  outputFormat: "text" | "json" | "json-array" | "stream";
  jsonSchema?: string | null;
  requiresJsonFormat?: boolean;
  promptValidationRules?: string[];
  defaultModel: string;
  availableModels: string[];
  defaultTemperature: number;
  defaultMaxTokens: number;
  isActive?: boolean;
}

export interface FinalAIConfig extends AIConfigData {
  finalPrompt: string; // systemPrompt + mandatoryInstructions combined and sanitized
}

// In-memory cache with TTL
const memoryCache = new Map<string, { data: FinalAIConfig; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get AI config with multi-tier caching
 */
export async function getAIConfig(
  featureKey: string
): Promise<FinalAIConfig | null> {
  // Check in-memory cache first
  const cached = memoryCache.get(featureKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  // Check Next.js cache
  const getCachedConfig = unstable_cache(
    async () => {
      const config = await prisma.aIConfig.findUnique({
        where: { featureKey, isActive: true },
      });

      if (!config) {
        return null;
      }

      // Build final prompt with mandatory instructions
      const finalPrompt = buildFinalPrompt(
        config.systemPrompt,
        config.mandatoryInstructions,
        config.outputFormat
      );

      return {
        ...config,
        finalPrompt,
      } as FinalAIConfig;
    },
    [`ai-config-${featureKey}`],
    {
      revalidate: 300, // 5 minutes
      tags: ["ai-configs", `ai-config-${featureKey}`],
    }
  );

  const config = await getCachedConfig();

  if (config) {
    // Store in memory cache
    memoryCache.set(featureKey, {
      data: config,
      expires: Date.now() + CACHE_TTL,
    });
  }

  return config;
}

/**
 * Get all AI configs
 */
export async function getAllAIConfigs(): Promise<FinalAIConfig[]> {
  const getCachedConfigs = unstable_cache(
    async () => {
      const configs = await prisma.aIConfig.findMany({
        where: { isActive: true },
        orderBy: [{ category: "asc" }, { featureName: "asc" }],
      });

      return configs.map((config) => {
        const finalPrompt = buildFinalPrompt(
          config.systemPrompt,
          config.mandatoryInstructions,
          config.outputFormat
        );

        return {
          ...config,
          finalPrompt,
        } as FinalAIConfig;
      });
    },
    ["ai-configs-all"],
    {
      revalidate: 300,
      tags: ["ai-configs"],
    }
  );

  return await getCachedConfigs();
}

/**
 * Update AI config with validation and cache invalidation
 */
export async function updateAIConfig(
  featureKey: string,
  data: Partial<AIConfigData>
): Promise<FinalAIConfig> {
  // Get existing config to preserve mandatory instructions
  const existing = await prisma.aIConfig.findUnique({
    where: { featureKey },
  });

  if (!existing) {
    throw new Error(`AI config not found: ${featureKey}`);
  }

  // Sanitize system prompt if provided
  let systemPrompt = data.systemPrompt ?? existing.systemPrompt;
  if (data.systemPrompt) {
    systemPrompt = sanitizePrompt(data.systemPrompt);
  }

  // Validate prompt if output format requires it
  const outputFormat =
    data.outputFormat ?? (existing.outputFormat as AIConfigData["outputFormat"]);
  const validationRules =
    data.promptValidationRules ?? existing.promptValidationRules ?? [];

  // Build the full prompt for validation (system + mandatory instructions)
  const mandatoryInstructions =
    data.mandatoryInstructions ?? existing.mandatoryInstructions;
  const fullPromptForValidation = buildFinalPrompt(
    systemPrompt,
    mandatoryInstructions,
    outputFormat
  );

  const validation = validatePrompt(
    fullPromptForValidation,
    outputFormat,
    validationRules
  );

  if (!validation.valid) {
    throw new Error(
      `Prompt validation failed: ${validation.errors.join(", ")}`
    );
  }

  // Update config
  const updated = await prisma.aIConfig.update({
    where: { featureKey },
    data: {
      ...data,
      systemPrompt,
      // Note: mandatoryInstructions should only be updated by system/seeding
      // We allow updates but should validate they still contain required constraints
      updatedAt: new Date(),
    },
  });

  // Invalidate caches
  revalidateTag("ai-configs");
  revalidateTag(`ai-config-${featureKey}`);
  memoryCache.delete(featureKey);

  // Build final prompt
  const finalPrompt = buildFinalPrompt(
    updated.systemPrompt,
    updated.mandatoryInstructions,
    updated.outputFormat
  );

  return {
    ...updated,
    finalPrompt,
  } as FinalAIConfig;
}

/**
 * Create AI config (used for seeding)
 */
export async function createAIConfig(
  data: AIConfigData
): Promise<FinalAIConfig> {
  // Sanitize system prompt
  const systemPrompt = sanitizePrompt(data.systemPrompt);

  // Ensure mandatory instructions exist for JSON outputs
  let mandatoryInstructions = data.mandatoryInstructions;
  if (
    (data.outputFormat === "json" || data.outputFormat === "json-array") &&
    !mandatoryInstructions
  ) {
    mandatoryInstructions = getDefaultMandatoryInstructions(
      data.outputFormat,
      data.jsonSchema ?? null
    );
  }

  // Build full prompt for validation
  const fullPromptForValidation = buildFinalPrompt(
    systemPrompt,
    mandatoryInstructions,
    data.outputFormat
  );

  const validation = validatePrompt(
    fullPromptForValidation,
    data.outputFormat,
    data.promptValidationRules ?? []
  );

  if (!validation.valid) {
    throw new Error(
      `Prompt validation failed: ${validation.errors.join(", ")}`
    );
  }

  const created = await prisma.aIConfig.create({
    data: {
      ...data,
      systemPrompt,
      mandatoryInstructions,
      isActive: data.isActive ?? true,
    },
  });

  // Invalidate caches
  revalidateTag("ai-configs");

  const finalPrompt = buildFinalPrompt(
    created.systemPrompt,
    created.mandatoryInstructions,
    created.outputFormat
  );

  return {
    ...created,
    finalPrompt,
  } as FinalAIConfig;
}

/**
 * Clear in-memory cache for a specific feature
 */
export function clearMemoryCache(featureKey?: string) {
  if (featureKey) {
    memoryCache.delete(featureKey);
  } else {
    memoryCache.clear();
  }
}
