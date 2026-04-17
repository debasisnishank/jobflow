"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Company,
  JobLocation,
  JobSource,
  JobStatus,
  JobTitle,
} from "@/models/job.model";
import { useJobsContainer } from "./hooks/useJobsContainer";
import { JobsContainerHeader } from "./JobsContainerHeader";
import { KanbanBoard } from "./KanbanBoard";
import Loading from "../Loading";
import { Card, CardContent } from "../ui/card";

type MyJobsProps = {
  statuses: JobStatus[];
  companies: Company[];
  titles: JobTitle[];
  locations: JobLocation[];
  sources: JobSource[];
};

function JobsContainer({
  statuses,
  companies,
  titles,
  locations,
  sources,
}: MyJobsProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    jobs,
    editJob,
    loading,
    duration,
    dateRange,
    onDeleteJob,
    onEditJob,
    onChangeJobStatus,
    resetEditJob,
    onFilterChange,
    onDurationChange,
    onDateRangeChange,
    downloadJobsList,
  } = useJobsContainer();

  const handleJobClick = (jobId: string) => {
    router.push(`/dashboard/myjobs/${jobId}`);
  };

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <JobsContainerHeader
            onFilterChange={onFilterChange}
            onDownload={downloadJobsList}
            loading={loading}
            statuses={statuses}
            companies={companies}
            titles={titles}
            locations={locations}
            sources={sources}
            editJob={editJob}
            resetEditJob={resetEditJob}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            duration={duration}
            onDurationChange={onDurationChange}
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <Loading />
              </div>
            )}
            {!loading && jobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No jobs found. Add your first job to get started!</p>
              </div>
            ) : (
              <KanbanBoard
                jobs={jobs}
                statuses={statuses}
                onStatusChange={onChangeJobStatus}
                onJobClick={handleJobClick}
                onEditJob={onEditJob}
                onDeleteJob={onDeleteJob}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobsContainer;
