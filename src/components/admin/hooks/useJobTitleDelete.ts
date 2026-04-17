"use strict";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { deleteJobTitleById } from "@/actions/jobtitle.actions";
import { JobTitle } from "@/models/job.model";
import { AlertDialog } from "@/models/alertDialog.model";

export function useJobTitleDelete(reloadJobTitles: () => void) {
  const [alert, setAlert] = useState<AlertDialog>({
    openState: false,
    deleteAction: false,
  });

  const onDeleteJobTitle = (title: JobTitle) => {
    if (title._count?.jobs! > 0) {
      setAlert({
        openState: true,
        title: "Applied jobs exist!",
        description:
          "Associated jobs applied must be 0 to be able to delete this job title",
        deleteAction: false,
      });
    } else {
      setAlert({
        openState: true,
        deleteAction: true,
        itemId: title.id,
      });
    }
  };

  const deleteJobTitle = async (titleId: string) => {
    if (titleId) {
      const { success, message } = await deleteJobTitleById(titleId);
      if (success) {
        toast({
          variant: "success",
          description: `Job title has been deleted successfully`,
        });
        reloadJobTitles();
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: message,
        });
      }
    }
  };

  return {
    alert,
    setAlert,
    onDeleteJobTitle,
    deleteJobTitle,
  };
}

















