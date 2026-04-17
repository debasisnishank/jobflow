"use client";

import { CardTitle } from "../ui/card";
import { ActivityFormDialog } from "./ActivityFormDialog";

interface ActivitiesContainerHeaderProps {
  activityFormOpen: boolean;
  setActivityFormOpen: (open: boolean) => void;
  closeActivityForm: () => void;
  reloadActivities: () => void;
}

export function ActivitiesContainerHeader({
  activityFormOpen,
  setActivityFormOpen,
  closeActivityForm,
  reloadActivities,
}: ActivitiesContainerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Activities
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Track your time and productivity
        </p>
      </div>
      <ActivityFormDialog
        open={activityFormOpen}
        onOpenChange={setActivityFormOpen}
        onClose={closeActivityForm}
        onReload={reloadActivities}
        testId="add-activity-btn"
      />
    </div>
  );
}

















