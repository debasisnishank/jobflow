"use client";

import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import Loading from "../Loading";

interface CoverLetterAIGenerateButtonProps {
  generating: boolean;
  selectedResumeId: string;
  onGenerate: () => void;
}

export function CoverLetterAIGenerateButton({
  generating,
  selectedResumeId,
  onGenerate,
}: CoverLetterAIGenerateButtonProps) {
  return (
    <div className="space-y-2">
      <Button
        onClick={onGenerate}
        disabled={generating || !selectedResumeId}
        className="w-full"
      >
        {generating ? (
          <>
            <Loading />
            <span className="ml-2">Generating with OpenAI...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with AI (OpenAI)
          </>
        )}
      </Button>
      {!selectedResumeId && (
        <p className="text-xs text-muted-foreground text-center">
          Please select a resume to generate a cover letter
        </p>
      )}
    </div>
  );
}

















