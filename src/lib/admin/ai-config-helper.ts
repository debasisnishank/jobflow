"use strict";
import "server-only";

import { getAIConfig } from "./ai-config.service";
import { getDefaultAIPrompt, DEFAULT_AI_PROMPTS } from "./ai-prompts-defaults";

export interface AIConfigValues {
  systemPrompt: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
}

export async function getAIConfigWithDefaults(
  featureKey: string
): Promise<AIConfigValues> {
  const defaultConfig = getDefaultAIPrompt(featureKey);
  
  if (!defaultConfig) {
    throw new Error(`No default prompt configuration found for feature: ${featureKey}`);
  }

  try {
    const config = await getAIConfig(featureKey);
    if (config) {
      return {
        systemPrompt: config.finalPrompt || config.systemPrompt,
        modelName: config.defaultModel,
        temperature: config.defaultTemperature,
        maxTokens: config.defaultMaxTokens,
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch AI config for ${featureKey}, using defaults:`, error);
  }

  return {
    systemPrompt: defaultConfig.systemPrompt,
    modelName: defaultConfig.defaultModel,
    temperature: defaultConfig.defaultTemperature,
    maxTokens: defaultConfig.defaultMaxTokens,
  };
}

export function getAllDefaultFeatureKeys(): string[] {
  return Object.keys(DEFAULT_AI_PROMPTS);
}
