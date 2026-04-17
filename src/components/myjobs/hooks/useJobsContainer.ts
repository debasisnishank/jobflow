"use strict";

import { useCallback, useEffect, useState } from "react";
import { getJobsList } from "@/actions/job.actions";
import { toast } from "@/components/ui/use-toast";
import { JobResponse, JobStatus } from "@/models/job.model";
import { APP_CONSTANTS } from "@/lib/constants";
import { useJobDownload } from "./useJobDownload";
import { useJobActions } from "./useJobActions";

export function useJobsContainer() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filterKey, setFilterKey] = useState<string>();
  const [duration, setDuration] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({});
  const [editJob, setEditJob] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, Partial<JobResponse>>>(new Map());
  const [isReloading, setIsReloading] = useState(false);

  const jobsPerPage = APP_CONSTANTS.RECORDS_PER_PAGE;

  const loadJobs = useCallback(
    async (page: number, filter?: string, duration?: string, customDateRange?: { startDate?: Date; endDate?: Date }, bypassCache = false) => {
      if (loading && !bypassCache) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: filter ? jobsPerPage.toString() : "1000",
        });
        if (filter) params.append("filter", filter);
        if (duration) params.append("duration", duration);
        if (customDateRange?.startDate) {
          const startDate = new Date(customDateRange.startDate);
          const year = startDate.getFullYear();
          const month = startDate.getMonth();
          const day = startDate.getDate();
          const utcStartDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
          params.append("startDate", utcStartDate.toISOString());
        }
        if (customDateRange?.endDate) {
          const endDate = new Date(customDateRange.endDate);
          const year = endDate.getFullYear();
          const month = endDate.getMonth();
          const day = endDate.getDate();
          const utcEndDate = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
          params.append("endDate", utcEndDate.toISOString());
        }
        if (bypassCache) {
          params.append("_t", Date.now().toString());
        }

        const fetchOptions: RequestInit = bypassCache ? {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        } : {};

        const response = await fetch(`/api/jobs?${params}`, fetchOptions);
        const result = await response.json();
        
        if (result.success && result.data) {
          const jobsData = result.data as JobResponse[];
          setJobs((prev) => {
            if (page === 1) {
              return jobsData.length > 0 ? jobsData : prev.length > 0 ? prev : jobsData;
            }
            return [...prev, ...jobsData];
          });
          setTotalJobs(result.total ?? 0);
          setPage(page);
          setOptimisticUpdates(new Map());
        } else {
          setJobs((prev) => {
            if (page === 1 && prev.length === 0) {
              toast({
                variant: "destructive",
                title: "Error!",
                description: result.message || "Failed to load jobs",
              });
            }
            return prev;
          });
        }
      } catch (error) {
        setJobs((prev) => {
          if (page === 1 && prev.length === 0) {
            toast({
              variant: "destructive",
              title: "Error!",
              description: "Failed to load jobs",
            });
          }
          return prev;
        });
      } finally {
        setLoading(false);
      }
    },
    [jobsPerPage, loading]
  );

  const reloadJobs = useCallback(async () => {
    if (isReloading) return;
    setIsReloading(true);
    try {
      await loadJobs(1, filterKey, duration, dateRange, true);
      if (filterKey !== "none") {
        setFilterKey("none");
      }
    } finally {
      setIsReloading(false);
    }
  }, [loadJobs, filterKey, duration, dateRange, isReloading]);

  const resetEditJob = () => {
    setEditJob(null);
  };

  const onFilterChange = (filterBy: string) => {
    if (filterBy === "none") {
      setFilterKey(undefined);
      loadJobs(1, undefined, duration, dateRange);
    } else {
      setFilterKey(filterBy);
      loadJobs(1, filterBy, duration, dateRange);
    }
  };

  const onDurationChange = (newDuration: string) => {
    setDuration(newDuration);
    if (newDuration !== "custom") {
      setDateRange({});
    }
    loadJobs(1, filterKey, newDuration, newDuration === "custom" ? dateRange : undefined);
  };

  const onDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    const newDateRange = { startDate, endDate };
    setDateRange(newDateRange);
    if (startDate && endDate) {
      loadJobs(1, filterKey, "custom", newDateRange);
    }
  };

  const { downloadJobsList } = useJobDownload();

  const updateJobOptimistically = useCallback((jobId: string, status: JobStatus) => {
    setJobs((prevJobs) => {
      return prevJobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            Status: status,
          };
        }
        return job;
      });
    });
  }, []);

  const { onDeleteJob, onEditJob, onChangeJobStatus } = useJobActions({
    setEditJob,
    reloadJobs,
    updateJobOptimistically,
  });

  useEffect(() => {
    (async () => await loadJobs(1, filterKey, duration, dateRange))();
  }, []);

  return {
    jobs,
    page,
    totalJobs,
    filterKey,
    duration,
    dateRange,
    editJob,
    loading,
    loadJobs,
    reloadJobs,
    onDeleteJob,
    onEditJob,
    onChangeJobStatus,
    resetEditJob,
    onFilterChange,
    onDurationChange,
    onDateRangeChange,
    downloadJobsList,
  };
}

