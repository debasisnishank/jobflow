"use client";

import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import Loading from "../Loading";
import { AiModel, ResumeReviewResponse } from "@/models/ai.model";
import { AiResumeReviewResponseContent } from "./AiResumeReviewResponseContent";
import { Info, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface AiResumeReviewSheetContentProps {
  selectedModel: AiModel;
  loading: boolean;
  isStreaming: boolean;
  aIContent: ResumeReviewResponse | any;
  onGetReview: () => void;
}

export function AiResumeReviewSheetContent({
  selectedModel,
  loading,
  isStreaming,
  aIContent,
  onGetReview,
}: AiResumeReviewSheetContentProps) {
  return (
    <SheetContent className="overflow-y-scroll">
      <SheetHeader>
        <SheetTitle className="flex flex-row items-center">
          AI Review ({selectedModel.provider})
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground mx-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{`Provider: ${selectedModel.provider}`}</p>
                <p>{`Model: ${selectedModel.model}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SheetTitle>
      </SheetHeader>
      <div className="mt-4">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1 cursor-pointer"
          onClick={onGetReview}
          disabled={loading || isStreaming}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Generate AI Review
          </span>
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center flex-col">
          <Loading />
          <div>Loading...</div>
        </div>
      ) : (
        <AiResumeReviewResponseContent content={typeof aIContent === "string" ? aIContent : JSON.stringify(aIContent)} />
      )}
    </SheetContent>
  );
}

















