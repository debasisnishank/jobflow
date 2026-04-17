"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { addDays } from "date-fns";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import { JOB_TYPES } from "@/models/job.model";
import { JobResponse } from "@/models/job.model";
import { Resume } from "@/models/profile.model";
import { getResumeList } from "@/actions/profile.actions";
import { JobStatus } from "@/models/job.model";

export function useAddJobForm(
  jobStatuses: JobStatus[],
  editJob?: JobResponse | null
) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isPending, startTransition] = useTransition();

  const statusesArray = Array.isArray(jobStatuses) ? jobStatuses : [];
  const defaultStatusId = statusesArray.find((s) => s.value === "draft")?.id ?? statusesArray[0]?.id ?? "";
  const appliedStatusId = statusesArray.find((s) => s.value === "applied")?.id ?? statusesArray[1]?.id ?? defaultStatusId;

  const form = useForm<z.infer<typeof AddJobFormSchema>>({
    resolver: zodResolver(AddJobFormSchema),
    defaultValues: {
      type: Object.keys(JOB_TYPES)[0],
      dueDate: addDays(new Date(), 3),
      status: defaultStatusId || "",
      salaryRange: "1",
      salaryCurrency: "USD",
      applied: false,
    },
  });

  const { setValue, reset, watch, resetField } = form;
  const appliedValue = watch("applied");

  const loadResumes = useCallback(async () => {
    try {
      const resumes = await getResumeList();
      setResumes(resumes.data);
    } catch (error) {
      // Error handled silently
    }
  }, []);

  useEffect(() => {
    if (editJob) {
      reset(
        {
          id: editJob.id,
          userId: editJob.userId,
          title: editJob.JobTitle?.id || "",
          company: editJob.Company?.id || "",
          location: editJob.Location?.id || "",
          type: editJob.jobType || Object.keys(JOB_TYPES)[0],
          source: editJob.JobSource?.id || "",
          status: editJob.Status?.id || defaultStatusId,
          dueDate: editJob.dueDate || addDays(new Date(), 3),
          salaryRange: editJob.salaryRange || "1",
          salaryCurrency: editJob.salaryCurrency || "USD",
          jobDescription: editJob.description || "",
          applied: editJob.applied || false,
          jobUrl: editJob.jobUrl ?? undefined,
          dateApplied: editJob.appliedDate ?? undefined,
          resume: editJob.Resume?.id ?? undefined,
        },
        { keepDefaultValues: true }
      );
      setDialogOpen(true);
    }
  }, [editJob, reset, defaultStatusId]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const setNewResumeId = (id: string) => {
    setTimeout(() => {
      setValue("resume", id);
    }, 500);
  };

  const resetForm = () => {
    reset({
      type: Object.keys(JOB_TYPES)[0],
      dueDate: addDays(new Date(), 3),
      status: defaultStatusId || "",
      salaryRange: "1",
      salaryCurrency: "USD",
      applied: false,
    });
  };

  const jobAppliedChange = (applied: boolean) => {
    if (applied) {
      const currentStatus = form.getValues("status");
      if (currentStatus === defaultStatusId && appliedStatusId) {
        setValue("status", appliedStatusId, { shouldValidate: true });
      }
      setValue("dateApplied", new Date(), { shouldValidate: true });
    } else {
      resetField("dateApplied");
      if (defaultStatusId) {
        setValue("status", defaultStatusId, { shouldValidate: true });
      }
    }
  };

  return {
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
    defaultStatusId,
    loadResumes,
    setNewResumeId,
    resetForm,
    jobAppliedChange,
  };
}









