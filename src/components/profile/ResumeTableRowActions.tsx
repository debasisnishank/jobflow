"use client";

import {
  FilePenLine,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { Resume } from "@/models/profile.model";

interface ResumeTableRowActionsProps {
  resume: Resume;
  onEditResume: (resume: Resume) => void;
  onDeleteResume: (resume: Resume) => void;
}

export function ResumeTableRowActions({
  resume,
  onEditResume,
  onDeleteResume,
}: ResumeTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-haspopup="true"
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-muted"
          data-testid="resume-actions-menu-btn"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-border/50">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onEditResume(resume)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Resume Title
        </DropdownMenuItem>
        {!resume.FileId && (
          <Link href={`/dashboard/resume-builder/${resume.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <FilePenLine className="mr-2 h-4 w-4" />
              View/Edit Resume
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          onClick={() => onDeleteResume(resume)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

















