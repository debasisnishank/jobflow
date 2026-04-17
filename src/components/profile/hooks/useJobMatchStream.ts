"use client";

import { useCallback } from "react";
import { AiModel, JobMatchResponse } from "@/models/ai.model";
import { useStreamingResponse } from "@/hooks/useStreamingResponse";

export function useJobMatchStream() {
  const {
    content: aIContent,
    loading,
    streamResponse,
    abortStream,
  } = useStreamingResponse<string>({
    errorTitle: "Error!",
    errorMessage: "Error fetching job matching response",
  });

  const getJobMatch = useCallback(
    async (resumeId: string, jobId: string, selectedModel: AiModel) => {
      await streamResponse("/api/ai/resume/match", {
        resumeId,
        jobId,
        selectedModel,
      });
    },
    [streamResponse]
  );

  return {
    aIContent,
    loading,
    getJobMatch,
    abortStream,
  };
}

