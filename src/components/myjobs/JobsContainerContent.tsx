"use client";

import { Button } from "../ui/button";
import MyJobsTable from "./MyJobsTable";
import { JobResponse, JobStatus } from "@/models/job.model";

interface JobsContainerContentProps {
  jobs: JobResponse[];
  totalJobs: number;
  page: number;
  loading: boolean;
  filterKey?: string;
  statuses: JobStatus[];
  onDeleteJob: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onChangeJobStatus: (jobId: string, jobStatus: JobStatus) => void;
  onLoadMore: () => void;
}

export function JobsContainerContent({
  jobs,
  totalJobs,
  page,
  loading,
  filterKey,
  statuses,
  onDeleteJob,
  onEditJob,
  onChangeJobStatus,
  onLoadMore,
}: JobsContainerContentProps) {
  return (
    <>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <MyJobsTable
          jobs={jobs}
          jobStatuses={statuses}
          deleteJob={onDeleteJob}
          editJob={onEditJob}
          onChangeJobStatus={onChangeJobStatus}
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {1} to {jobs.length}
          </strong>{" "}
          of <strong className="text-foreground">{totalJobs}</strong> jobs
        </span>
      </div>
      {jobs.length < totalJobs && (
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

















