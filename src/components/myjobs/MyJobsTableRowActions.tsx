"use client";

import {
  ListCollapse,
  MoreHorizontal,
  Pencil,
  Tags,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { JobResponse, JobStatus } from "@/models/job.model";

interface MyJobsTableRowActionsProps {
  job: JobResponse;
  jobStatuses: JobStatus[];
  onViewDetails: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onChangeJobStatus: (id: string, status: JobStatus) => void;
  onDeleteJob: (jobId: string) => void;
}

export function MyJobsTableRowActions({
  job,
  jobStatuses,
  onViewDetails,
  onEditJob,
  onChangeJobStatus,
  onDeleteJob,
}: MyJobsTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-haspopup="true"
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-muted"
          data-testid="job-actions-menu-btn"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] border-border/50"
      >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onViewDetails(job?.id)}
          >
            <ListCollapse className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onEditJob(job.id)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Job
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-4 w-4" />
              Change status
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-0 border-border/50">
                {jobStatuses.map((status) => (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    key={status.id}
                    onSelect={(_) => {
                      onChangeJobStatus(job.id, status);
                    }}
                    disabled={status.id === job.Status.id}
                  >
                    <span>{status.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
            onClick={() => onDeleteJob(job.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

















