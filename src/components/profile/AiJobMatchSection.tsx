"use client";
import {
  Sheet,
  SheetPortal,
} from "../ui/sheet";
import { useState } from "react";
import { AiModel, defaultModel } from "@/models/ai.model";
import { getFromLocalStorage } from "@/utils/localstorage.utils";
import { useJobMatchStream } from "./hooks/useJobMatchStream";
import { useJobMatchResumes } from "./hooks/useJobMatchResumes";
import { AiJobMatchSheetContent } from "./AiJobMatchSheetContent";

interface AiSectionProps {
  aISectionOpen: boolean;
  triggerChange: (openState: boolean) => void;
  jobId: string;
}

export const AiJobMatchSection = ({
  aISectionOpen,
  triggerChange,
  jobId,
}: AiSectionProps) => {
  const [selectedResumeId, setSelectedResumeId] = useState<string>();
  const selectedModel: AiModel = getFromLocalStorage(
    "aiSettings",
    defaultModel
  );

  const { resumes } = useJobMatchResumes();
  const { aIContent, loading, getJobMatch, abortStream } = useJobMatchStream();

  const onSelectResume = async (resumeId: string) => {
    setSelectedResumeId(resumeId);
    await getJobMatch(resumeId, jobId, selectedModel);
  };

  const handleSheetChange = (openState: boolean) => {
    triggerChange(openState);
    if (!openState) {
      abortStream();
    }
  };

  return (
    <Sheet open={aISectionOpen} onOpenChange={handleSheetChange}>
      <SheetPortal>
        <AiJobMatchSheetContent
          selectedModel={selectedModel}
          resumes={resumes}
          selectedResumeId={selectedResumeId}
          aIContent={aIContent}
          loading={loading}
          onSelectResume={onSelectResume}
        />
      </SheetPortal>
    </Sheet>
  );
};
