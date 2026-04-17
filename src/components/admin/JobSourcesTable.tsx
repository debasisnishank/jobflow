"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { JobSource } from "@/models/job.model";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { useJobSourceDelete } from "./hooks/useJobSourceDelete";
import { JobSourcesTableRow } from "./JobSourcesTableRow";

type JobSourcesTableProps = {
  sources: (JobSource & {
    _count?: { jobsApplied: number };
  })[];
  reloadSources: () => Promise<void>;
};

export default function JobSourcesTable({
  sources,
  reloadSources,
}: JobSourcesTableProps) {
  const { alertOpen, setAlertOpen, onDelete, confirmDelete } =
    useJobSourceDelete(reloadSources);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-[#3B82F6]/5">
            <TableHead className="font-semibold">Source Name</TableHead>
            <TableHead className="font-semibold">Jobs Linked</TableHead>
            <TableHead className="w-[60px] text-right font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <JobSourcesTableRow
              key={source.id}
              source={source}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
      <DeleteAlertDialog
        pageTitle="job source"
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onDelete={confirmDelete}
      />
    </>
  );
}

