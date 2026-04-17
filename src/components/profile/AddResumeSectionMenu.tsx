"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Resume, SectionType } from "@/models/profile.model";

interface AddResumeSectionMenuProps {
  resume: Resume;
  onOpenContactInfo: () => void;
  onOpenSummary: () => void;
  onOpenExperience: () => void;
  onOpenEducation: () => void;
}

export function AddResumeSectionMenu({
  resume,
  onOpenContactInfo,
  onOpenSummary,
  onOpenExperience,
  onOpenEducation,
}: AddResumeSectionMenuProps) {
  const summarySection = resume?.ResumeSections?.find(
    (section) => section.sectionType === SectionType.SUMMARY
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1 cursor-pointer"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Section
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={onOpenContactInfo}
            disabled={!!resume?.ContactInfo}
          >
            Add Contact Info
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={onOpenSummary}
            disabled={!!summarySection}
          >
            Add Summary
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onOpenExperience}>
            Add Experience
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onOpenEducation}>
            Add Education
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

















