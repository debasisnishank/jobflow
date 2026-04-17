"use strict";

import { useState } from "react";
import { deleteActivityById } from "@/actions/activity.actions";
import { toast } from "@/components/ui/use-toast";

export function useActivityDelete(reloadActivities: () => void) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [activityIdToDelete, setActivityIdToDelete] = useState<string>();

  const onDeleteActivity = (id: string) => {
    setAlertOpen(true);
    setActivityIdToDelete(id);
  };

  const deleteActivity = async () => {
    if (!activityIdToDelete) {
      return;
    }
    const { success, message } = await deleteActivityById(activityIdToDelete);
    if (success) {
      toast({
        variant: "success",
        description: `Activity has been deleted successfully`,
      });
      reloadActivities();
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: message,
      });
    }
    setAlertOpen(false);
  };

  return {
    alertOpen,
    setAlertOpen,
    onDeleteActivity,
    deleteActivity,
  };
}

















