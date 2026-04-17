"use strict";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { deleteJobSourceById } from "@/actions/job.actions";

export function useJobSourceDelete(reloadSources: () => Promise<void>) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [sourceIdToDelete, setSourceIdToDelete] = useState<string | null>(null);

  const onDelete = (sourceId: string) => {
    setSourceIdToDelete(sourceId);
    setAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!sourceIdToDelete) return;
    const result = await deleteJobSourceById(sourceIdToDelete);
    if (!result?.success) {
      toast({
        variant: "destructive",
        title: "Unable to delete source",
        description:
          result?.message ||
          "This source is linked to existing jobs and cannot be deleted.",
      });
    } else {
      toast({
        variant: "success",
        description: "Job source deleted.",
      });
      await reloadSources();
    }
    setAlertOpen(false);
  };

  return {
    alertOpen,
    setAlertOpen,
    sourceIdToDelete,
    onDelete,
    confirmDelete,
  };
}

















