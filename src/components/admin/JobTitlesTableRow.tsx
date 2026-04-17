"use client";

import {
  TableCell,
  TableRow,
} from "../ui/table";
import { JobTitle } from "@/models/job.model";
import { JobTitlesTableRowActions } from "./JobTitlesTableRowActions";

interface JobTitlesTableRowProps {
  title: JobTitle;
  onDeleteJobTitle: (title: JobTitle) => void;
}

export function JobTitlesTableRow({
  title,
  onDeleteJobTitle,
}: JobTitlesTableRowProps) {
  return (
    <TableRow key={title.id}>
      <TableCell className="font-medium">{title.label}</TableCell>
      <TableCell className="font-medium">
        {title._count?.jobs}
      </TableCell>
      <TableCell>
        <JobTitlesTableRowActions
          title={title}
          onDeleteJobTitle={onDeleteJobTitle}
        />
      </TableCell>
    </TableRow>
  );
}









