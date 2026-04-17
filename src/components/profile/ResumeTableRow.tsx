"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Paperclip } from "lucide-react";
import {
  TableCell,
  TableRow,
} from "../ui/table";
import { Resume } from "@/models/profile.model";
import { ResumeTableRowActions } from "./ResumeTableRowActions";

interface ResumeTableRowProps {
  resume: Resume;
  onEditResume: (resume: Resume) => void;
  onDeleteResume: (resume: Resume) => void;
}

export function ResumeTableRow({
  resume,
  onEditResume,
  onDeleteResume,
}: ResumeTableRowProps) {
  return (
    <TableRow
      key={resume.id}
      className="border-border/50 hover:bg-[#3B82F6]/5 transition-colors"
    >
      <TableCell className="font-medium">
        <Link
          href={`/dashboard/profile/resume/${resume.id}`}
          className="flex items-center text-foreground hover:text-[#3B82F6] transition-colors"
        >
          {resume.title}
          {resume.FileId ? (
            <Paperclip className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
          ) : null}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {resume.createdAt && format(resume.createdAt, "PP")}
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {resume.updatedAt && format(resume.updatedAt, "PP")}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary border border-primary/20">
          {resume._count?.Job || 0}
        </span>
      </TableCell>
      <TableCell>
        <ResumeTableRowActions
          resume={resume}
          onEditResume={onEditResume}
          onDeleteResume={onDeleteResume}
        />
      </TableCell>
    </TableRow>
  );
}

















