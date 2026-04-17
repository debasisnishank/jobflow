"use client";

import { File } from "lucide-react";
import { AddJob } from "./AddJob";
import {
  Company,
  JobLocation,
  JobResponse,
  JobSource,
  JobStatus,
  JobTitle,
} from "@/models/job.model";

interface JobsContainerEmptyStateProps {
  statuses: JobStatus[];
  companies: Company[];
  titles: JobTitle[];
  locations: JobLocation[];
  sources: JobSource[];
  editJob: JobResponse | null;
  resetEditJob: () => void;
}

export function JobsContainerEmptyState({
  statuses,
  companies,
  titles,
  locations,
  sources,
  editJob,
  resetEditJob,
}: JobsContainerEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted/50 p-6 mb-4">
        <File className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Start tracking your job applications by adding your first opportunity.
      </p>
      <AddJob
        jobStatuses={statuses}
        companies={companies}
        jobTitles={titles}
        locations={locations}
        jobSources={sources}
        editJob={editJob}
        resetEditJob={resetEditJob}
      />
    </div>
  );
}

















