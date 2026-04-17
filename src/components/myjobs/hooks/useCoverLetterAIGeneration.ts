"use strict";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { streamCoverLetterResponse } from "./useCoverLetterAIStream";
import { getSelectedAIModel } from "./useAIModelSelection";

interface UseCoverLetterAIGenerationProps {
  selectedResumeId: string;
  selectedTemplateId: string;
  jobId: string;
  setCoverLetterForm: React.Dispatch<React.SetStateAction<{
    title: string;
    content: string;
    templateId: string;
  }>>;
  coverLetterForm: {
    title: string;
    content: string;
    templateId: string;
  };
}

export function useCoverLetterAIGeneration({
  selectedResumeId,
  selectedTemplateId,
  jobId,
  setCoverLetterForm,
  coverLetterForm,
}: UseCoverLetterAIGenerationProps) {
  const [generating, setGenerating] = useState(false);

  const generateCoverLetter = async () => {
    if (!selectedResumeId || selectedResumeId === "none") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a resume",
      });
      return;
    }

    try {
      setGenerating(true);
      setCoverLetterForm({ ...coverLetterForm, content: "" });

      const requestBody: {
        resumeId: string;
        jobId: string;
        templateId?: string;
        model?: string;
      } = {
        resumeId: selectedResumeId,
        jobId,
      };

      if (selectedTemplateId && selectedTemplateId !== "none") {
        requestBody.templateId = selectedTemplateId;
      }

      requestBody.model = getSelectedAIModel();

      await streamCoverLetterResponse(
        requestBody,
        setCoverLetterForm,
        coverLetterForm
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate cover letter";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setGenerating(false);
    }
  };

  return {
    generating,
    generateCoverLetter,
  };
}

