"use client";

import { JobResponse } from "@/models/job.model";
import { JobDetailsQuickActions } from "./JobDetailsQuickActions";
import { JobDetailsInfo } from "./JobDetailsInfo";
import { useResumeDownload } from "./hooks/useResumeDownload";

interface JobDetailsSidebarProps {
  job: JobResponse;
  isExpired: boolean;
}

export function JobDetailsSidebar({
  job,
  isExpired,
}: JobDetailsSidebarProps) {
  const { handleDownloadResume } = useResumeDownload();

  const onDownloadResume = () => {
    if (job?.Resume?.File?.id) {
      handleDownloadResume(
        job.Resume.File.id,
        job.Resume.File.fileName
      );
    }
  };

  return (
    <div className="space-y-6">
      <JobDetailsQuickActions job={job} onDownloadResume={onDownloadResume} />
      <JobDetailsInfo job={job} isExpired={isExpired} />
    </div>
  );
}

