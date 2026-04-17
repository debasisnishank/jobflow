export interface ResumeReviewResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
}
export interface JobMatchResponse {
  matching_score: number;
  detailed_analysis: JobMatchAnalysis[];
  suggestions: JobMatchAnalysis[];
  additional_comments: string[];
}

export type JobMatchAnalysis = {
  category: string;
  value: string[];
};

export interface AiModel {
  provider: AiProvider;
  model: string | undefined;
}

export enum AiProvider {
  OPENAI = "openai",
}

export enum OpenaiModel {
  GPT4O_MINI = "gpt-4o-mini",
  // GPT4o = "gpt-4o",
  // GPT4_TURBO = "gpt-4-turbo", // expensive model, but faster
}

export const defaultModel: AiModel = {
  provider: AiProvider.OPENAI,
  model: OpenaiModel.GPT4O_MINI,
};
