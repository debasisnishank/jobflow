"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  addMinutes,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";
import { AddActivityFormSchema } from "@/models/addActivityForm.schema";
import { ActivityType } from "@/models/activity.model";
import { getAllActivityTypes } from "@/actions/activity.actions";
import { combineDateAndTime } from "@/lib/utils";

type Duration = {
  hours: number;
  minutes: number;
};

export function useActivityForm() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [duration, setDuration] = useState<Duration | null>(null);

  const defaultValues = useMemo(() => {
    const now = new Date();
    const currentTime = format(now, "hh:mm a");
    const nowPlus5mins = addMinutes(now, 5);
    const estimatedEndTime = format(nowPlus5mins, "hh:mm a");

    return {
      activityName: "",
      activityType: "",
      startDate: now,
      startTime: currentTime,
      endDate: now,
      endTime: estimatedEndTime,
    };
  }, []);

  const form = useForm<z.infer<typeof AddActivityFormSchema>>({
    resolver: zodResolver(AddActivityFormSchema),
    defaultValues,
  });

  const { getValues, watch } = form;

  const loadActivityTypes = useCallback(async () => {
    const activityTypes = await getAllActivityTypes();
    setActivityTypes(activityTypes);
  }, []);

  const calculateDuration = useCallback(() => {
    const [startDate, startTime, endDate, endTime] = getValues([
      "startDate",
      "startTime",
      "endDate",
      "endTime",
    ]);
    const startDateTime =
      startDate && startTime ? combineDateAndTime(startDate, startTime) : null;

    const endDateTime =
      endDate && endTime ? combineDateAndTime(endDate!, endTime!) : null;

    if (startDateTime && endDateTime) {
      const hours = differenceInHours(endDateTime, startDateTime);
      const totalMinutes = differenceInMinutes(endDateTime, startDateTime);
      const minutes = totalMinutes % 60;

      setDuration({ hours, minutes });
    } else {
      setDuration(null);
    }
  }, [getValues]);

  useEffect(() => {
    loadActivityTypes();
    const subscription = watch((value, { name }) => {
      if (
        ["startDate", "startTime", "endDate", "endTime"].includes(name || "")
      ) {
        calculateDuration();
      }
    });

    return () => subscription.unsubscribe();
  }, [calculateDuration, loadActivityTypes, watch]);

  return {
    form,
    activityTypes,
    duration,
  };
}

















