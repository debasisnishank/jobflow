"use client";

import { Button } from "../ui/button";
import { ActivitiesTable } from "./ActivitiesTable";
import { Activity } from "@/models/activity.model";
import Loading from "../Loading";

interface ActivitiesContentProps {
  loading: boolean;
  activitiesList: Activity[];
  totalActivities: number;
  currentActivity?: Activity;
  page: number;
  onLoadMore: () => void;
  onReload: () => void;
  onStartActivity: (activityId: string) => void;
}

export function ActivitiesContent({
  loading,
  activitiesList,
  totalActivities,
  currentActivity,
  page,
  onLoadMore,
  onReload,
  onStartActivity,
}: ActivitiesContentProps) {
  if (loading && activitiesList.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <ActivitiesTable
          activities={activitiesList}
          reloadActivities={onReload}
          onStartActivity={onStartActivity}
          activityExist={Boolean(currentActivity)}
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {1} to {activitiesList.length}
          </strong>{" "}
          of <strong className="text-foreground">{totalActivities}</strong>{" "}
          activities
        </span>
      </div>
      {activitiesList.length < totalActivities && (
        <div className="flex justify-center pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[120px] border-border/60 hover:bg-primary hover:text-primary-foreground"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}

