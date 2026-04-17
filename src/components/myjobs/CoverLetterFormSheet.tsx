"use client";

import { Button } from "../ui/button";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { Plus } from "lucide-react";
import { CoverLetter } from "@/models/coverLetter.model";
import { Resume } from "@/models/profile.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { useCoverLetterForm } from "./hooks/useCoverLetterForm";
import { CoverLetterFormSheetContent } from "./CoverLetterFormSheetContent";

interface CoverLetterFormSheetProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
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
  isEditing: boolean;
  editingCoverLetter: CoverLetter | null;
  setIsEditing: (editing: boolean) => void;
  setEditingCoverLetter: (letter: CoverLetter | null) => void;
  jobId: string;
  templates: CoverLetterTemplate[];
  resumes: Resume[];
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  onSaveSuccess: () => void;
}

export function CoverLetterFormSheet({
  isSheetOpen,
  setIsSheetOpen,
  coverLetterForm,
  setCoverLetterForm,
  isEditing,
  editingCoverLetter,
  setIsEditing,
  setEditingCoverLetter,
  jobId,
  templates,
  resumes,
  selectedResumeId,
  setSelectedResumeId,
  selectedTemplateId,
  setSelectedTemplateId,
  onSaveSuccess,
}: CoverLetterFormSheetProps) {
  const { loading, handleSaveCoverLetter, resetForm: resetFormHook } =
    useCoverLetterForm({
      jobId,
      isEditing,
      editingCoverLetter,
      setIsEditing,
      setEditingCoverLetter,
      setCoverLetterForm,
      setIsSheetOpen,
      onSaveSuccess,
    });

  const resetForm = () => {
    resetFormHook(setCoverLetterForm);
  };

  const handleSave = async () => {
    await handleSaveCoverLetter(coverLetterForm);
  };

  const handleClose = () => {
    setIsSheetOpen(false);
    resetForm();
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button size="sm" onClick={resetForm}>
          <Plus className="h-4 w-4 mr-2" />
          New Cover Letter
        </Button>
      </SheetTrigger>
      <CoverLetterFormSheetContent
        isEditing={isEditing}
        coverLetterForm={coverLetterForm}
        setCoverLetterForm={setCoverLetterForm}
        templates={templates}
        resumes={resumes}
        selectedResumeId={selectedResumeId}
        setSelectedResumeId={setSelectedResumeId}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        jobId={jobId}
        loading={loading}
        onSave={handleSave}
        onClose={handleClose}
      />
    </Sheet>
  );
}
