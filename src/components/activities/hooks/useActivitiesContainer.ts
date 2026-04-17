"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getActivitiesList,
  getCurrentActivity,
  startActivityById,
} from "@/actions/activity.actions";
import { Activity } from "@/models/activity.model";
import { toast } from "@/components/ui/use-toast";

export function useActivitiesContainer() {
  const [activityFormOpen, setActivityFormOpen] = useState<boolean>(false);
  const [activitiesList, setActivitiesList] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [page, setPage] = useState<number>(1);
  const [totalActivities, setTotalActivities] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const closeActivityForm = () => setActivityFormOpen(false);

  const loadActivities = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const { data, success, message, total } = await getActivitiesList(page);
      if (success) {
        setActivitiesList((prev) => (page === 1 ? data : [...prev, ...data]));
        setTotalActivities(total);
        setPage(page);
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to load activities. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadActivities = useCallback(async () => {
    await loadActivities(1);
  }, [loadActivities]);

  const startActivity = async (activityId: string) => {
    const { newActivity, success, message } = await startActivityById(
      activityId
    );
    if (success && newActivity) {
      setCurrentActivity(newActivity as Activity);
      toast({
        variant: "success",
        description: "Activity started successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: message,
      });
    }
  };

  const fetchActiveActivity = useCallback(async () => {
    const { activity, success } = await getCurrentActivity();
    if (success && activity) {
      setCurrentActivity(activity);
      return activity;
    }
    return null;
  }, []);

  useEffect(() => {
    (async () => await loadActivities(1))();
  }, [loadActivities]);

  return {
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
  };
}

