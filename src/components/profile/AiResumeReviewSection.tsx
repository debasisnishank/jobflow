"use client";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetPortal, SheetTrigger } from "../ui/sheet";
import { Resume } from "@/models/profile.model";
import { AiModel, defaultModel } from "@/models/ai.model";
import { getFromLocalStorage } from "@/utils/localstorage.utils";
import { useResumeReviewStream } from "./hooks/useResumeReviewStream";
import { AiResumeReviewSheetContent } from "./AiResumeReviewSheetContent";
import { useState } from "react";

interface AiSectionProps {
  resume: Resume;
}

const AiResumeReviewSection = ({ resume }: AiSectionProps) => {
  const [aISectionOpen, setAiSectionOpen] = useState(false);
  const selectedModel: AiModel = getFromLocalStorage(
    "aiSettings",
    defaultModel
  );
  const { aIContent, loading, isStreaming, getResumeReview, abortStream } =
    useResumeReviewStream();

  const triggerSheetChange = async (openState: boolean) => {
    setAiSectionOpen(openState);
    if (openState === false) {
      abortStream();
    }
  };

  const handleGetReview = () => {
    getResumeReview(resume, selectedModel);
  };

  return (
    <Sheet open={aISectionOpen} onOpenChange={triggerSheetChange}>
      <div className="ml-2">
        <SheetTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 cursor-pointer"
            onClick={() => triggerSheetChange(true)}
            disabled={loading || resume.ResumeSections?.length! < 2}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Review
            </span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetPortal>
        <AiResumeReviewSheetContent
          selectedModel={selectedModel}
          loading={loading}
          isStreaming={isStreaming}
          aIContent={aIContent}
          onGetReview={handleGetReview}
        />
      </SheetPortal>
    </Sheet>
  );
};

export default AiResumeReviewSection;
