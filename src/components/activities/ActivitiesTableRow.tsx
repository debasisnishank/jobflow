"use client";

import { format } from "date-fns";
import {
  TableCell,
  TableRow,
} from "../ui/table";
import { Activity, ActivityType } from "@/models/activity.model";
import { ActivityRowActions } from "./ActivityRowActions";

interface ActivitiesTableRowProps {
  activity: Activity;
  activityExist: boolean;
  onStartActivity: (activityId: string) => void;
  onDeleteActivity: (id: string) => void;
  calculateDuration: (totalMinutes: number) => string;
}

export function ActivitiesTableRow({
  activity,
  activityExist,
  onStartActivity,
  onDeleteActivity,
  calculateDuration,
}: ActivitiesTableRowProps) {
  return (
    <TableRow
      key={activity.id}
      className="border-border/50 hover:bg-[#3B82F6]/5 transition-colors group relative"
    >
      <TableCell className="hidden md:table-cell w-[120px] text-muted-foreground">
        {activity.startTime ? format(activity.startTime, "PP") : "N/A"}
      </TableCell>
      <TableCell className="font-medium text-foreground">
        {activity.activityName}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary border border-primary/20">
          {(activity.activityType as ActivityType)?.label}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {format(activity.startTime, "p")}
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {activity.endTime ? format(activity.endTime, "p") : "—"}
      </TableCell>
      <TableCell className="font-medium text-foreground">
        {activity.startTime &&
        activity.endTime &&
        activity.duration !== null &&
        activity.duration !== undefined
          ? calculateDuration(activity.duration)
          : "—"}
      </TableCell>
      <TableCell>
        <ActivityRowActions
          activityId={activity.id!}
          activityExist={activityExist}
          onStartActivity={onStartActivity}
          onDeleteActivity={onDeleteActivity}
        />
      </TableCell>
    </TableRow>
  );
}

















