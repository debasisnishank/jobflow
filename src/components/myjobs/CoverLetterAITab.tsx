"use client";

import { Resume } from "@/models/profile.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { useCoverLetterAIGeneration } from "./hooks/useCoverLetterAIGeneration";
import { CoverLetterAITabContent } from "./CoverLetterAITabContent";

interface CoverLetterAITabProps {
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  resumes: Resume[];
  templates: CoverLetterTemplate[];
  coverLetterForm: {
    title: string;
    content: string;
    templateId: string;
  };
  setCoverLetterForm: React.Dispatch<React.SetStateAction<{
    title: string;
    content: string;
    templateId: string;
  }>>;
  jobId: string;
}

export function CoverLetterAITab({
  selectedResumeId,
  setSelectedResumeId,
  selectedTemplateId,
  setSelectedTemplateId,
  resumes,
  templates,
  coverLetterForm,
  setCoverLetterForm,
  jobId,
}: CoverLetterAITabProps) {
  const { generating, generateCoverLetter } = useCoverLetterAIGeneration({
    selectedResumeId,
    selectedTemplateId,
    jobId,
    setCoverLetterForm,
    coverLetterForm,
  });

  return (
    <CoverLetterAITabContent
      selectedResumeId={selectedResumeId}
      setSelectedResumeId={setSelectedResumeId}
      selectedTemplateId={selectedTemplateId}
      setSelectedTemplateId={setSelectedTemplateId}
      resumes={resumes}
      templates={templates}
      generating={generating}
      onGenerate={generateCoverLetter}
      content={coverLetterForm.content}
      onContentChange={(content) =>
        setCoverLetterForm({ ...coverLetterForm, content })
      }
    />
  );
}

