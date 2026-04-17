"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { addJob, updateJob } from "@/actions/job.actions";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import {
  Company,
  JobLocation,
  JobResponse,
  JobSource,
  JobTitle,
} from "@/models/job.model";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { redirect } from "next/navigation";
import { useAddJobForm } from "./hooks/useAddJobForm";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import { JobStatus } from "@/models/job.model";
import { AddJobDialogContent } from "./AddJobDialogContent";

type AddJobProps = {
  jobStatuses: JobStatus[];
  companies: Company[];
  jobTitles: JobTitle[];
  locations: JobLocation[];
  jobSources: JobSource[];
  editJob?: JobResponse | null;
  resetEditJob: () => void;
};

export function AddJob({
  jobStatuses,
  companies,
  jobTitles,
  locations,
  jobSources,
  editJob,
  resetEditJob,
}: AddJobProps) {
  const {
    form,
    dialogOpen,
    setDialogOpen,
    resumeDialogOpen,
    setResumeDialogOpen,
    resumes,
    isPending,
    startTransition,
    appliedValue,
    statusesArray,
    loadResumes,
    setNewResumeId,
    resetForm,
    jobAppliedChange,
  } = useAddJobForm(jobStatuses, editJob);

  const [_, startSubmitTransition] = useTransition();

  function onSubmit(data: z.infer<typeof AddJobFormSchema>) {
    startSubmitTransition(async () => {
      const result = editJob
        ? await updateJob(data)
        : await addJob(data);
      const success = result.success;
      const message = "message" in result ? result.message : undefined;
      resetForm();
      setDialogOpen(false);
      if (!success) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: message,
        });
      }
      redirect("/dashboard/myjobs");
    });
    toast({
      variant: "success",
      description: `Job has been ${editJob ? "updated" : "created"} successfully`,
    });
  }

  const pageTitle = editJob ? "Edit Job" : "Add Job";

  const addJobForm = () => {
    resetForm();
    resetEditJob();
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  return (
    <>
      <Button
        size="default"
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={addJobForm}
        data-testid="add-job-btn"
      >
        <PlusCircle className="h-4 w-4" />
        <span>+ Add Job</span>
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AddJobDialogContent
          pageTitle={pageTitle}
          form={form}
          jobTitles={jobTitles}
          companies={companies}
          locations={locations}
          jobSources={jobSources}
          appliedValue={appliedValue}
          statusesArray={statusesArray}
          resumes={resumes}
          resumeDialogOpen={resumeDialogOpen}
          setResumeDialogOpen={setResumeDialogOpen}
          isPending={isPending}
          onJobAppliedChange={jobAppliedChange}
          onReloadResumes={loadResumes}
          onSetNewResumeId={setNewResumeId}
          onSubmit={onSubmit}
          onClose={closeDialog}
        />
      </Dialog>
    </>
  );
}
