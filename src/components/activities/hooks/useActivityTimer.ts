"use client";

import { useCallback, useRef, useState } from "react";
import { APP_CONSTANTS } from "@/lib/constants";
import { Activity } from "@/models/activity.model";
import { stopActivityById } from "@/actions/activity.actions";
import { toast } from "@/components/ui/use-toast";
import { differenceInMinutes } from "date-fns";

interface UseActivityTimerProps {
  currentActivity: Activity | undefined;
  onStop: () => void;
}

export function useActivityTimer({
  currentActivity,
  onStop,
}: UseActivityTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeElapsed(0);
  }, []);

  const stopActivity = useCallback(
    async (autoStop: boolean = false) => {
      if (!currentActivity) {
        return;
      }
      const now = new Date();
      const maxDurationMinutes =
        APP_CONSTANTS.ACTIVITY_MAX_DURATION_MS / (1000 * 60);
      const duration = Math.min(
        differenceInMinutes(now, currentActivity.startTime),
        maxDurationMinutes
      );
      const { success, message } = await stopActivityById(
        currentActivity.id!,
        now,
        duration
      );
      if (success) {
        stopTimer();
        onStop();
        toast({
          variant: "success",
          description: autoStop
            ? `Activity auto-stopped after reaching maximum duration of ${
                maxDurationMinutes / 60
              } hours`
            : "Activity stopped successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: message,
        });
      }
    },
    [currentActivity, onStop, stopTimer]
  );

  const startTimer = useCallback(
    (startTime: number) => {
      const initialElapsed = Date.now() - startTime;

      if (initialElapsed >= APP_CONSTANTS.ACTIVITY_MAX_DURATION_MS) {
        setTimeout(() => stopActivity(true), 0);
        return;
      }

      stopTimer();
      setTimeElapsed(initialElapsed);

      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newElapsed = prev + 1000;
          if (newElapsed >= APP_CONSTANTS.ACTIVITY_MAX_DURATION_MS) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setTimeout(() => stopActivity(true), 0);
            return APP_CONSTANTS.ACTIVITY_MAX_DURATION_MS;
          }
          return newElapsed;
        });
      }, 1000);
    },
    [stopActivity, stopTimer]
  );

  return {
    timeElapsed,
    stopTimer,
    stopActivity,
    startTimer,
  };
}

