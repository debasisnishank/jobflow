"use client";

import { useCallback } from "react";
import { Resume } from "@/models/profile.model";
import { AiModel, ResumeReviewResponse } from "@/models/ai.model";
import { useStreamingResponse } from "@/hooks/useStreamingResponse";

export function useResumeReviewStream() {
  const {
    content: aIContent,
    loading,
    isStreaming,
    streamResponse,
    abortStream,
  } = useStreamingResponse<string>({
    errorTitle: "Error!",
    errorMessage: "Error fetching resume review",
  });

  const getResumeReview = useCallback(
    async (resume: Resume, selectedModel: AiModel) => {
      if (!resume || resume.ResumeSections?.length === 0) {
        throw new Error("Resume content is required");
      }

      await streamResponse("/api/ai/resume/review", {
        selectedModel,
        resume,
      });
    },
    [streamResponse]
  );

  return {
    aIContent,
    loading,
    isStreaming,
    getResumeReview,
    abortStream,
  };
}


