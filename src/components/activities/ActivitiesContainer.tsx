"use client";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useEffect } from "react";
import { ActivityType } from "@/models/activity.model";
import { ActivityBanner } from "./ActivityBanner";
import { ActivitiesEmptyState } from "./ActivitiesEmptyState";
import { ActivitiesContent } from "./ActivitiesContent";
import { useActivitiesContainer } from "./hooks/useActivitiesContainer";
import { useActivityTimer } from "./hooks/useActivityTimer";
import { ActivitiesContainerHeader } from "./ActivitiesContainerHeader";

function ActivitiesContainer() {
  const {
    activityFormOpen,
    setActivityFormOpen,
    activitiesList,
    currentActivity,
    setCurrentActivity,
    page,
    totalActivities,
    loading,
    closeActivityForm,
    loadActivities,
    reloadActivities,
    startActivity,
    fetchActiveActivity,
  } = useActivitiesContainer();

  const handleStopActivity = () => {
    setCurrentActivity(undefined);
    reloadActivities();
  };

  const { timeElapsed, stopTimer, stopActivity, startTimer } =
    useActivityTimer({
      currentActivity,
      onStop: handleStopActivity,
    });

  useEffect(() => {
    const init = async () => {
      const activity = await fetchActiveActivity();
      if (activity && activity.startTime) {
        const startTimeValue = activity.startTime instanceof Date 
          ? activity.startTime.getTime() 
          : new Date(activity.startTime).getTime();
        startTimer(startTimeValue);
      }
      await loadActivities(1);
    };
    init();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentActivity && currentActivity.startTime) {
      const startTimeValue = currentActivity.startTime instanceof Date 
        ? currentActivity.startTime.getTime() 
        : new Date(currentActivity.startTime).getTime();
      startTimer(startTimeValue);
    }
  }, [currentActivity, startTimer]);

  const handleLoadMore = () => {
    loadActivities(page + 1);
  };

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
        <ActivitiesContainerHeader
          activityFormOpen={activityFormOpen}
          setActivityFormOpen={setActivityFormOpen}
          closeActivityForm={closeActivityForm}
          reloadActivities={reloadActivities}
        />
      </CardHeader>
      <CardContent className="p-6">
        {currentActivity && (
          <ActivityBanner
            message={`${
              (currentActivity.activityType as ActivityType)?.label
            } - ${currentActivity.activityName}`}
            onStopActivity={stopActivity}
            elapsedTime={timeElapsed}
          />
        )}
        {activitiesList.length > 0 ? (
          <ActivitiesContent
            loading={loading}
            activitiesList={activitiesList}
            totalActivities={totalActivities}
            currentActivity={currentActivity}
            page={page}
            onLoadMore={handleLoadMore}
            onReload={reloadActivities}
            onStartActivity={startActivity}
          />
        ) : (
          <ActivitiesEmptyState
            activityFormOpen={activityFormOpen}
            setActivityFormOpen={setActivityFormOpen}
            closeActivityForm={closeActivityForm}
            reloadActivities={reloadActivities}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default ActivitiesContainer;
