"use strict";

import { toast } from "@/components/ui/use-toast";
import {
  deleteCoverLetter,
  setCoverLetterAsCurrent,
} from "@/actions/coverLetter.actions";

export function useCoverLetterActions(onReload: () => void) {
  const handleDelete = async (coverLetterId: string) => {
    if (!confirm("Are you sure you want to delete this cover letter?")) {
      return;
    }

    try {
      await deleteCoverLetter(coverLetterId);
      toast({
        title: "Success",
        description: "Cover letter deleted successfully",
      });
      onReload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete cover letter",
      });
    }
  };

  const handleSetAsCurrent = async (coverLetterId: string) => {
    try {
      await setCoverLetterAsCurrent(coverLetterId);
      toast({
        title: "Success",
        description: "Cover letter set as current version",
      });
      onReload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set cover letter as current",
      });
    }
  };

  return {
    handleDelete,
    handleSetAsCurrent,
  };
}

















