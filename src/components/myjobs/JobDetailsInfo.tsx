"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { JobResponse } from "@/models/job.model";
import { Calendar, Clock } from "lucide-react";

interface JobDetailsInfoProps {
  job: JobResponse;
  isExpired: boolean;
}

export function JobDetailsInfo({ job, isExpired }: JobDetailsInfoProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Job Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Created
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {format(new Date(job.createdAt), "MMM d, yyyy")}
            </div>
          </div>
          {job.appliedDate && (
            <>
              <div className="h-px bg-border my-2" />
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Applied Date
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(job.appliedDate), "MMM d, yyyy")}
                </div>
              </div>
            </>
          )}
          {job.dueDate && (
            <>
              <div className="h-px bg-border my-2" />
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Application Deadline
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    isExpired && "text-red-500"
                  )}
                >
                  <Clock className="h-4 w-4" />
                  {format(new Date(job.dueDate), "MMM d, yyyy")}
                </div>
              </div>
            </>
          )}
          {job.JobSource && (
            <>
              <div className="h-px bg-border my-2" />
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Source
                </div>
                <div className="text-sm">{job.JobSource.label}</div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

















