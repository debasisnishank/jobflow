"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import { JobResponse, JobStatus } from "@/models/job.model";
import { useRouter } from "next/navigation";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { MyJobsTableRow } from "./MyJobsTableRow";

type MyJobsTableProps = {
  jobs: JobResponse[];
  jobStatuses: JobStatus[];
  deleteJob: (id: string) => void;
  editJob: (id: string) => void;
  onChangeJobStatus: (id: string, status: JobStatus) => void;
};

function MyJobsTable({
  jobs,
  jobStatuses,
  deleteJob,
  editJob,
  onChangeJobStatus,
}: MyJobsTableProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState("");

  const router = useRouter();
  const viewJobDetails = (jobId: string) => {
    router.push(`/dashboard/myjobs/${jobId}`);
  };

  const onDeleteJob = (jobId: string) => {
    setAlertOpen(true);
    setJobIdToDelete(jobId);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-[#3B82F6]/5">
            <TableHead className="hidden w-[100px] sm:table-cell font-semibold">
              <span className="sr-only">Company Logo</span>
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Date Applied
            </TableHead>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Location
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Source
            </TableHead>
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job: JobResponse) => (
            <MyJobsTableRow
              key={job.id}
              job={job}
              jobStatuses={jobStatuses}
              onViewDetails={viewJobDetails}
              onEditJob={editJob}
              onChangeJobStatus={onChangeJobStatus}
              onDeleteJob={onDeleteJob}
            />
          ))}
        </TableBody>
      </Table>
      <DeleteAlertDialog
        pageTitle="job"
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onDelete={() => deleteJob(jobIdToDelete)}
      />
    </>
  );
}

export default MyJobsTable;
