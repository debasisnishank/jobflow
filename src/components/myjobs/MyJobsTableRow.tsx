"use client";

import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  TableCell,
  TableRow,
} from "../ui/table";
import { JobResponse, JobStatus } from "@/models/job.model";
import { MyJobsTableRowActions } from "./MyJobsTableRowActions";
import { CompanyLogo } from "../ui/CompanyLogo";

interface MyJobsTableRowProps {
  job: JobResponse;
  jobStatuses: JobStatus[];
  onViewDetails: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onChangeJobStatus: (id: string, status: JobStatus) => void;
  onDeleteJob: (jobId: string) => void;
}

export function MyJobsTableRow({
  job,
  jobStatuses,
  onViewDetails,
  onEditJob,
  onChangeJobStatus,
  onDeleteJob,
}: MyJobsTableRowProps) {
  return (
    <TableRow
      key={job.id}
      className="border-border/50 hover:bg-[#3B82F6]/5 transition-colors"
    >
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center">
          <CompanyLogo
            alt="Company logo"
            className="aspect-square rounded-lg object-cover border border-border/50"
            height={40}
            src={job.Company?.logoUrl}
            width={40}
          />
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell w-[120px] text-muted-foreground">
        {job.appliedDate ? format(job.appliedDate, "PP") : "N/A"}
      </TableCell>
      <TableCell className="font-medium">
        <Link
          href={`/dashboard/myjobs/${job?.id}`}
          className="text-foreground hover:text-[#3B82F6] transition-colors"
        >
          {job.JobTitle?.label}
        </Link>
      </TableCell>
      <TableCell className="font-medium text-foreground">
        {job.Company?.label}
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {job.Location?.label || "—"}
      </TableCell>
      <TableCell>
        {job.dueDate && new Date() > job.dueDate && job.Status?.value === "draft" ? (
          <Badge className="bg-red-500/90 text-white border-0">Expired</Badge>
        ) : (
          <Badge
            className={cn(
              "w-fit px-2.5 py-0.5 justify-center font-medium border-0",
              job.Status?.value === "applied" && "bg-cyan-500/90 text-white",
              job.Status?.value === "interview" && "bg-green-500/90 text-white",
              job.Status?.value === "draft" && "bg-yellow-500/90 text-white",
              job.Status?.value === "rejected" && "bg-red-500/90 text-white",
              !job.Status?.value && "bg-muted text-muted-foreground"
            )}
          >
            {job.Status?.label}
          </Badge>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {job.JobSource?.label || "—"}
      </TableCell>
      <TableCell>
        <MyJobsTableRowActions
          job={job}
          jobStatuses={jobStatuses}
          onViewDetails={onViewDetails}
          onEditJob={onEditJob}
          onChangeJobStatus={onChangeJobStatus}
          onDeleteJob={onDeleteJob}
        />
      </TableCell>
    </TableRow>
  );
}

