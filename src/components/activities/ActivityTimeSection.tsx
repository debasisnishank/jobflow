"use client";

import { Clock } from "lucide-react";
import { Control } from "react-hook-form";
import { AddActivityFormSchema } from "@/models/addActivityForm.schema";
import { z } from "zod";
import { ActivityDurationCard } from "./ActivityDurationCard";
import { ActivityTimeFields } from "./ActivityTimeFields";

interface ActivityTimeSectionProps {
  control: Control<z.infer<typeof AddActivityFormSchema>>;
  duration: { hours: number; minutes: number } | null;
}

export function ActivityTimeSection({
  control,
  duration,
}: ActivityTimeSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Time & Duration
        </h3>
      </div>
      <ActivityDurationCard duration={duration} />
      <ActivityTimeFields control={control} />
    </div>
  );
}

