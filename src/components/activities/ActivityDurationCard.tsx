"use client";

import { AlertCircle, Info } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface ActivityDurationCardProps {
  duration: { hours: number; minutes: number } | null;
}

function formatDuration(dur: { hours: number; minutes: number } | null): string {
  if (!dur) return "";
  if (dur.hours === 0 && dur.minutes === 0) return "0 minutes";
  const parts: string[] = [];
  if (dur.hours > 0)
    parts.push(`${dur.hours} ${dur.hours === 1 ? "hour" : "hours"}`);
  if (dur.minutes > 0)
    parts.push(`${dur.minutes} ${dur.minutes === 1 ? "minute" : "minutes"}`);
  return parts.join(" and ");
}

export function ActivityDurationCard({
  duration,
}: ActivityDurationCardProps) {
  if (!duration) return null;

  const isWarning = duration.hours >= 8;

  return (
    <Card
      className={`${
        isWarning
          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
          : "bg-primary/5 border-primary/20"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {isWarning ? (
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          ) : (
            <Info className="h-4 w-4 text-primary" />
          )}
          <span
            className={`text-sm font-medium ${
              isWarning
                ? "text-red-900 dark:text-red-100"
                : "text-foreground"
            }`}
          >
            Duration:{" "}
            <span
              className={`font-semibold ${
                isWarning ? "text-red-700 dark:text-red-300" : "text-primary"
              }`}
            >
              {formatDuration(duration)}
            </span>
            {isWarning && (
              <span className="block text-xs mt-1 text-red-700 dark:text-red-300">
                Maximum allowed duration is 8 hours. Please split into multiple
                activities.
              </span>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

















