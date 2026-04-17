"use client";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Resume } from "@/models/profile.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { CoverLetterAIInfoCard } from "./CoverLetterAIInfoCard";
import { CoverLetterAISelects } from "./CoverLetterAISelects";
import { CoverLetterAIGenerateButton } from "./CoverLetterAIGenerateButton";

interface CoverLetterAITabContentProps {
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  resumes: Resume[];
  templates: CoverLetterTemplate[];
  generating: boolean;
  onGenerate: () => void;
  content: string;
  onContentChange: (content: string) => void;
}

export function CoverLetterAITabContent({
  selectedResumeId,
  setSelectedResumeId,
  selectedTemplateId,
  setSelectedTemplateId,
  resumes,
  templates,
  generating,
  onGenerate,
  content,
  onContentChange,
}: CoverLetterAITabContentProps) {
  return (
    <div className="space-y-4">
      <CoverLetterAIInfoCard />
      <CoverLetterAISelects
        selectedResumeId={selectedResumeId}
        setSelectedResumeId={setSelectedResumeId}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        resumes={resumes}
        templates={templates}
      />
      <CoverLetterAIGenerateButton
        generating={generating}
        selectedResumeId={selectedResumeId}
        onGenerate={onGenerate}
      />
      {content && (
        <div>
          <Label>Generated Content</Label>
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[400px] font-mono text-sm mt-2"
          />
        </div>
      )}
    </div>
  );
}

