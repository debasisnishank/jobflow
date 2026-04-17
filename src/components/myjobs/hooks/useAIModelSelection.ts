"use strict";

import { getFromLocalStorage } from "@/utils/localstorage.utils";
import { AiModel, defaultModel } from "@/models/ai.model";

const OPENAI_MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4-turbo",
  "gpt-4",
  "gpt-4o-mini",
];
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export function getSelectedAIModel(): string {
  const selectedModel: AiModel = getFromLocalStorage(
    "aiSettings",
    defaultModel
  );
  let openAiModel = DEFAULT_OPENAI_MODEL;

  if (
    selectedModel.model &&
    OPENAI_MODELS.includes(selectedModel.model.toLowerCase())
  ) {
    openAiModel = selectedModel.model;
  }

  return openAiModel;
}

















