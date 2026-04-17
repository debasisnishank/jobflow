"use strict";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { deleteResumeById } from "@/actions/profile.actions";
import { Resume } from "@/models/profile.model";

export function useResumeDelete(reloadResumes: () => void) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume>();

  const onDeleteResume = (resume: Resume) => {
    if (!resume.id) return;
    setAlertOpen(true);
    setResumeToDelete(resume);
  };

  const deleteResume = async (resume: Resume) => {
    if (!resume.id) return;
    if (resume._count?.Job! > 0) {
      return toast({
        variant: "destructive",
        title: "Error!",
        description: "Number of jobs using resume must be 0!",
      });
    }
    const { success, message } = await deleteResumeById(resume.id);
    if (success) {
      toast({
        variant: "success",
        description: `Resume has been deleted successfully`,
      });
      reloadResumes();
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: message,
      });
    }
  };

  return {
    alertOpen,
    setAlertOpen,
    resumeToDelete,
    onDeleteResume,
    deleteResume,
  };
}

















