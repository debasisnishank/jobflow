"use strict";

import { useCallback } from "react";
import {
  deleteJobById,
  getJobDetails,
  updateJobStatus,
} from "@/actions/job.actions";
import { toast } from "@/components/ui/use-toast";
import { JobResponse, JobStatus } from "@/models/job.model";

interface UseJobActionsProps {
  setEditJob: (job: JobResponse | null) => void;
  reloadJobs: () => void;
  updateJobOptimistically?: (jobId: string, status: JobStatus) => void;
}

export function useJobActions({ setEditJob, reloadJobs, updateJobOptimistically }: UseJobActionsProps) {
  const onDeleteJob = useCallback(
    async (jobId: string) => {
      const result = await deleteJobById(jobId);
      if (result.success) {
        toast({
          variant: "success",
          description: `Job has been deleted successfully`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: result.message,
        });
      }
      reloadJobs();
    },
    [reloadJobs]
  );

  const onEditJob = useCallback(
    async (jobId: string) => {
      const result = await getJobDetails(jobId);
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: result.message,
        });
        return;
      }
      setEditJob(result.job ?? null);
    },
    [setEditJob]
  );

  const onChangeJobStatus = useCallback(
    async (jobId: string, jobStatus: JobStatus) => {
      let optimisticUpdateDone = false;
      
      if (updateJobOptimistically) {
        updateJobOptimistically(jobId, jobStatus);
        optimisticUpdateDone = true;
      }
      
      try {
        const result = await updateJobStatus(jobId, jobStatus);
        if (result.success) {
          toast({
            variant: "success",
            description: `Job status updated successfully`,
          });
          setTimeout(() => {
            reloadJobs();
          }, 500);
        } else {
          if (optimisticUpdateDone) {
            setTimeout(() => {
              reloadJobs();
            }, 100);
          }
          toast({
            variant: "destructive",
            title: "Error!",
            description: result.message || "Failed to update job status",
          });
        }
      } catch (error) {
        if (optimisticUpdateDone) {
          setTimeout(() => {
            reloadJobs();
          }, 100);
        }
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Failed to update job status. Please try again.",
        });
      }
    },
    [reloadJobs, updateJobOptimistically]
  );

  return {
    onDeleteJob,
    onEditJob,
    onChangeJobStatus,
  };
}

