"use client";

import { CirclePlay } from "lucide-react";
import { ActivityFormDialog } from "./ActivityFormDialog";

interface ActivitiesEmptyStateProps {
  activityFormOpen: boolean;
  setActivityFormOpen: (open: boolean) => void;
  closeActivityForm: () => void;
  reloadActivities: () => void;
}

export function ActivitiesEmptyState({
  activityFormOpen,
  setActivityFormOpen,
  closeActivityForm,
  reloadActivities,
}: ActivitiesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted/50 p-6 mb-4">
        <CirclePlay className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Start tracking your time by logging your first activity.
      </p>
      <ActivityFormDialog
        open={activityFormOpen}
        onOpenChange={setActivityFormOpen}
        onClose={closeActivityForm}
        onReload={reloadActivities}
      />
    </div>
  );
}

