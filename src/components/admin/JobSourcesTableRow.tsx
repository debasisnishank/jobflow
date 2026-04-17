"use client";

import {
  TableCell,
  TableRow,
} from "../ui/table";
import { JobSource } from "@/models/job.model";
import { JobSourcesTableRowActions } from "./JobSourcesTableRowActions";

interface JobSourcesTableRowProps {
  source: JobSource & {
    _count?: { jobsApplied: number };
  };
  onDelete: (sourceId: string) => void;
}

export function JobSourcesTableRow({
  source,
  onDelete,
}: JobSourcesTableRowProps) {
  return (
    <TableRow
      key={source.id}
      className="border-border/50 hover:bg-muted/40 transition-colors"
    >
      <TableCell className="font-medium">{source.label}</TableCell>
      <TableCell>
        {source._count?.jobsApplied ?? 0}
        <span className="text-xs text-muted-foreground ml-1">jobs</span>
      </TableCell>
      <TableCell className="text-right">
        <JobSourcesTableRowActions
          sourceId={source.id}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}









