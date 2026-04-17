"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import SelectFormCtrl from "../Select";
import TiptapEditor from "../TiptapEditor";
import { FileText } from "lucide-react";
import { Control } from "react-hook-form";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import { z } from "zod";
import { Resume } from "@/models/profile.model";
import CreateResume from "../profile/CreateResume";

interface JobFormResumeNotesProps {
  control: Control<z.infer<typeof AddJobFormSchema>>;
  resumes: Resume[];
  resumeDialogOpen: boolean;
  setResumeDialogOpen: (open: boolean) => void;
  onReloadResumes: () => void;
  onSetNewResumeId: (id: string) => void;
}

export function JobFormResumeNotes({
  control,
  resumes,
  resumeDialogOpen,
  setResumeDialogOpen,
  onReloadResumes,
  onSetNewResumeId,
}: JobFormResumeNotesProps) {
  const createResume = () => {
    setResumeDialogOpen(true);
  };

  // Transform Resume[] to SelectOption[]
  const resumeOptions = resumes
    .filter((resume) => resume.id) // Filter out resumes without id
    .map((resume) => ({
      id: resume.id!,
      label: resume.title || "Untitled Resume",
      value: resume.id!,
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <FileText className="h-4 w-4 text-primary" />
        Resume & notes
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <FormField
              control={control}
              name="resume"
              render={({ field }) => (
                <FormItem className="flex flex-col [&>button]:capitalize flex-1">
                  <FormLabel className="text-sm font-medium">Resume</FormLabel>
                  <SelectFormCtrl label="Resume" options={resumeOptions} field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              type="button"
              onClick={createResume}
              className="sm:w-auto"
            >
              Add new resume
            </Button>
            <CreateResume
              resumeDialogOpen={resumeDialogOpen}
              setResumeDialogOpen={setResumeDialogOpen}
              reloadResumes={onReloadResumes}
              setNewResumeId={onSetNewResumeId}
            />
          </div>
        </div>
        <FormField
          control={control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel id="job-description-label">Job Description / Notes</FormLabel>
              <FormControl>
                <TiptapEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

















