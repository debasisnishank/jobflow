"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";
import { CoverLetter } from "@/models/coverLetter.model";
import { Resume } from "@/models/profile.model";
import { CoverLetterFormSheet } from "./CoverLetterFormSheet";
import { CoverLetterTemplateDialog } from "./CoverLetterTemplateDialog";
import { CoverLetterList } from "./CoverLetterList";
import { useCoverLetterSection } from "./hooks/useCoverLetterSection";

interface CoverLetterSectionProps {
  jobId: string;
  resume?: Resume;
}

export function CoverLetterSection({
  jobId,
  resume,
}: CoverLetterSectionProps) {
  const {
    coverLetters,
    templates,
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    selectedTemplateId,
    setSelectedTemplateId,
    loadCoverLetters,
    loadTemplates,
  } = useCoverLetterSection(jobId, resume);

  const [isEditing, setIsEditing] = useState(false);
  const [editingCoverLetter, setEditingCoverLetter] = useState<CoverLetter | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [coverLetterForm, setCoverLetterForm] = useState({
    title: "",
    content: "",
    templateId: "",
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleEdit = (coverLetter: CoverLetter) => {
    setEditingCoverLetter(coverLetter);
    setCoverLetterForm({
      title: coverLetter.title,
      content: coverLetter.content,
      templateId: coverLetter.templateId || "",
    });
    setIsEditing(true);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cover Letters
          </CardTitle>
          <div className="flex items-center gap-2">
            <CoverLetterFormSheet
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
              coverLetterForm={coverLetterForm}
              setCoverLetterForm={setCoverLetterForm}
              isEditing={isEditing}
              editingCoverLetter={editingCoverLetter}
              setIsEditing={setIsEditing}
              setEditingCoverLetter={setEditingCoverLetter}
              jobId={jobId}
              templates={templates}
              resumes={resumes}
              selectedResumeId={selectedResumeId}
              setSelectedResumeId={setSelectedResumeId}
              selectedTemplateId={selectedTemplateId}
              setSelectedTemplateId={setSelectedTemplateId}
              onSaveSuccess={loadCoverLetters}
            />
            <CoverLetterTemplateDialog
              isTemplateDialogOpen={isTemplateDialogOpen}
              setIsTemplateDialogOpen={setIsTemplateDialogOpen}
              templates={templates}
              onTemplateCreated={loadTemplates}
            />
          </div>
        </CardHeader>
        <CoverLetterList
          coverLetters={coverLetters}
          onEdit={handleEdit}
          onReload={loadCoverLetters}
        />
      </Card>
    </div>
  );
}
