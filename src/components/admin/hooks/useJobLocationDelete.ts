"use strict";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { deleteJobLocationById } from "@/actions/jobLocation.actions";
import { JobLocation } from "@/models/job.model";
import { AlertDialog } from "@/models/alertDialog.model";

export function useJobLocationDelete(reloadJobLocations: () => void) {
  const [alert, setAlert] = useState<AlertDialog>({
    openState: false,
    deleteAction: false,
  });

  const onDeleteJobLocation = (location: JobLocation) => {
    if (location._count?.jobsApplied! > 0) {
      setAlert({
        openState: true,
        title: "Applied jobs exist!",
        description:
          "Associated jobs applied must be 0 to be able to delete this job location",
        deleteAction: false,
      });
    } else {
      setAlert({
        openState: true,
        deleteAction: true,
        itemId: location.id,
      });
    }
  };

  const deleteJobLocation = async (locationId: string) => {
    if (locationId) {
      const { success, message } = await deleteJobLocationById(locationId);
      if (success) {
        toast({
          variant: "success",
          description: `Job location has been deleted successfully`,
        });
        reloadJobLocations();
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
    onDeleteJobLocation,
    deleteJobLocation,
  };
}

















