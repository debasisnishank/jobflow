"use client";

import { CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import CreateResume from "./CreateResume";
import { Resume } from "@/models/profile.model";

interface ProfileHeaderProps {
  resumeDialogOpen: boolean;
  setResumeDialogOpen: (open: boolean) => void;
  reloadResumes: () => void;
  resumeToEdit: Resume | null;
  setResumeToEdit: (resume: Resume | null) => void;
  onCreateResume: () => void;
}

export function ProfileHeader({
  resumeDialogOpen,
  setResumeDialogOpen,
  reloadResumes,
  resumeToEdit,
  setResumeToEdit,
  onCreateResume,
}: ProfileHeaderProps) {
  const setResumeId = (id: string) => {};

  return (
    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Profile
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your resumes and professional information
          </p>
        </div>
        <div className="flex items-center">
          <Button
            size="sm"
            className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            onClick={onCreateResume}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create Resume
            </span>
          </Button>
          <CreateResume
            resumeDialogOpen={resumeDialogOpen}
            setResumeDialogOpen={setResumeDialogOpen}
            reloadResumes={reloadResumes}
            resumeToEdit={resumeToEdit}
            setNewResumeId={setResumeId}
          />
        </div>
      </div>
    </CardHeader>
  );
}

















