"use client";

import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Loading from "../Loading";
import { AiModel, JobMatchResponse } from "@/models/ai.model";
import { AiJobMatchResponseContent } from "./AiJobMatchResponseContent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info } from "lucide-react";
import { Resume } from "@/models/profile.model";

interface AiJobMatchSheetContentProps {
  selectedModel: AiModel;
  resumes: Resume[];
  selectedResumeId?: string;
  aIContent: string;
  loading: boolean;
  onSelectResume: (resumeId: string) => void;
}

export function AiJobMatchSheetContent({
  selectedModel,
  resumes,
  selectedResumeId,
  aIContent,
  loading,
  onSelectResume,
}: AiJobMatchSheetContentProps) {
  return (
    <SheetContent className="overflow-y-scroll">
      <SheetHeader>
        <SheetTitle className="flex flex-row items-center">
          AI Job Match ({selectedModel.provider})
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
      {!selectedResumeId && (
        <div className="mt-4">
          <Select value={selectedResumeId} onValueChange={onSelectResume}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a resume" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {resumes.map((resume) => (
                  <SelectItem
                    key={resume.id}
                    value={resume.id!}
                    className="capitalize"
                  >
                    {resume.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="mt-2">
        {loading ? (
          <div className="flex items-center flex-col">
            <Loading />
            <div>Loading...</div>
          </div>
        ) : (
          <AiJobMatchResponseContent content={aIContent} />
        )}
      </div>
    </SheetContent>
  );
}

















