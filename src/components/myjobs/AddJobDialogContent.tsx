"use client";

import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader, Info } from "lucide-react";
import { Form } from "../ui/form";
import { Card, CardContent } from "../ui/card";
import { JobFormRoleDetails } from "./JobFormRoleDetails";
import { JobFormApplicationTracking } from "./JobFormApplicationTracking";
import { JobFormResumeNotes } from "./JobFormResumeNotes";
import { z } from "zod";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import { UseFormReturn } from "react-hook-form";
import { Company, JobLocation, JobSource, JobTitle, JobStatus } from "@/models/job.model";
import { Resume } from "@/models/profile.model";

interface AddJobDialogContentProps {
  pageTitle: string;
  form: UseFormReturn<z.infer<typeof AddJobFormSchema>>;
  jobTitles: JobTitle[];
  companies: Company[];
  locations: JobLocation[];
  jobSources: JobSource[];
  appliedValue: boolean;
  statusesArray: JobStatus[];
  resumes: Resume[];
  resumeDialogOpen: boolean;
  setResumeDialogOpen: (open: boolean) => void;
  isPending: boolean;
  onJobAppliedChange: (applied: boolean) => void;
  onReloadResumes: () => void;
  onSetNewResumeId: (id: string) => void;
  onSubmit: (data: z.infer<typeof AddJobFormSchema>) => void;
  onClose: () => void;
}

export function AddJobDialogContent({
  pageTitle,
  form,
  jobTitles,
  companies,
  locations,
  jobSources,
  appliedValue,
  statusesArray,
  resumes,
  resumeDialogOpen,
  setResumeDialogOpen,
  isPending,
  onJobAppliedChange,
  onReloadResumes,
  onSetNewResumeId,
  onSubmit,
  onClose,
}: AddJobDialogContentProps) {
  return (
    <DialogContent className="h-full xl:h-[85vh] lg:h-[95vh] lg:max-w-screen-lg lg:max-h-screen overflow-y-scroll">
      <DialogHeader>
        <DialogTitle data-testid="add-job-dialog-title">{pageTitle}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex gap-3 p-4">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary">
                Use this form to track every opportunity in one place. Include the
                original job posting link, set reminders with due dates, and keep
                resumes aligned with each application.
              </p>
            </CardContent>
          </Card>

          <JobFormRoleDetails
            control={form.control}
            jobTitles={jobTitles}
            companies={companies}
            locations={locations}
            jobSources={jobSources}
          />

          <JobFormApplicationTracking
            control={form.control}
            appliedValue={appliedValue}
            statusesArray={statusesArray}
            onAppliedChange={onJobAppliedChange}
          />

          <JobFormResumeNotes
            control={form.control}
            resumes={resumes}
            resumeDialogOpen={resumeDialogOpen}
            setResumeDialogOpen={setResumeDialogOpen}
            onReloadResumes={onReloadResumes}
            onSetNewResumeId={onSetNewResumeId}
          />

          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" data-testid="save-job-btn">
              Save
              {isPending && <Loader className="h-4 w-4 shrink-0 spinner ml-2" />}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

