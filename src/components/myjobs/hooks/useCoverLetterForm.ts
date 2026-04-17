"use client";

import { useState } from "react";
import { toast } from "../../ui/use-toast";
import {
  createCoverLetter,
  updateCoverLetter,
} from "@/actions/coverLetter.actions";
import { CoverLetter } from "@/models/coverLetter.model";

interface UseCoverLetterFormProps {
  jobId: string;
  isEditing: boolean;
  editingCoverLetter: CoverLetter | null;
  setIsEditing: (editing: boolean) => void;
  setEditingCoverLetter: (letter: CoverLetter | null) => void;
  setCoverLetterForm: React.Dispatch<React.SetStateAction<{
    title: string;
    content: string;
    templateId: string;
  }>>;
  setIsSheetOpen: (open: boolean) => void;
  onSaveSuccess: () => void;
}

export function useCoverLetterForm({
  jobId,
  isEditing,
  editingCoverLetter,
  setIsEditing,
  setEditingCoverLetter,
  setCoverLetterForm,
  setIsSheetOpen,
  onSaveSuccess,
}: UseCoverLetterFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSaveCoverLetter = async (
    coverLetterForm: {
      title: string;
      content: string;
      templateId: string;
    }
  ) => {
    if (!coverLetterForm.title || !coverLetterForm.content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingCoverLetter) {
        await updateCoverLetter(editingCoverLetter.id!, {
          title: coverLetterForm.title,
          content: coverLetterForm.content,
          templateId: coverLetterForm.templateId || undefined,
        });
        toast({
          title: "Success",
          description: "Cover letter updated successfully",
        });
      } else {
        await createCoverLetter(jobId, coverLetterForm);
        toast({
          title: "Success",
          description: "Cover letter created successfully",
        });
      }
      setIsEditing(false);
      setEditingCoverLetter(null);
      setCoverLetterForm(() => ({ title: "", content: "", templateId: "" }));
      setIsSheetOpen(false);
      onSaveSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save cover letter";

      if (
        errorMessage.includes("does not exist") ||
        errorMessage.includes("run: npx prisma")
      ) {
        toast({
          variant: "destructive",
          title: "Database Setup Required",
          description:
            "Please run: npx prisma generate && npx prisma db push to create the cover letter tables.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (
    setCoverLetterForm: React.Dispatch<React.SetStateAction<{
      title: string;
      content: string;
      templateId: string;
    }>>
  ) => {
    setIsEditing(false);
    setEditingCoverLetter(null);
    setCoverLetterForm(() => ({ title: "", content: "", templateId: "" }));
  };

  return {
    loading,
    handleSaveCoverLetter,
    resetForm,
  };
}

