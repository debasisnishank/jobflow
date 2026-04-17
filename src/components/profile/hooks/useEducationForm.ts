"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddEducationFormSchema } from "@/models/AddEductionForm.schema";
import { Education, ResumeSection } from "@/models/profile.model";
import { JobLocation } from "@/models/job.model";
import { getAllJobLocations } from "@/actions/jobLocation.actions";
import { addEducation, updateEducation } from "@/actions/profile.actions";
import { toast } from "../../ui/use-toast";

interface UseEducationFormProps {
  resumeId: string | undefined;
  sectionId: string | undefined;
  educationToEdit?: ResumeSection;
  setDialogOpen: (e: boolean) => void;
}

export function useEducationForm({
  resumeId,
  sectionId,
  educationToEdit,
  setDialogOpen,
}: UseEducationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [locations, setLocations] = useState<JobLocation[]>([]);

  const getLocationData = useCallback(async () => {
    const _locations = await getAllJobLocations();
    setLocations(_locations);
  }, []);

  const form = useForm<z.infer<typeof AddEducationFormSchema>>({
    resolver: zodResolver(AddEducationFormSchema),
    defaultValues: {
      resumeId,
      sectionId,
      degreeCompleted: true,
    },
  });

  const { watch, reset, formState, resetField } = form;
  const isDirty = formState.isDirty;
  const degreeCompletedValue = watch("degreeCompleted");

  useEffect(() => {
    getLocationData();
    if (educationToEdit) {
      const education: Education = educationToEdit?.educations?.at(0)!;
      reset(
        {
          id: education?.id,
          institution: education?.institution,
          degree: education?.degree,
          fieldOfStudy: education?.fieldOfStudy,
          location: education?.location.id,
          startDate: education?.startDate,
          endDate: education?.endDate,
          description: education?.description,
          degreeCompleted: !!education?.endDate,
        },
        { keepDefaultValues: true }
      );
    } else {
      reset(
        {
          resumeId,
          sectionId,
        },
        { keepDefaultValues: true }
      );
    }
  }, [getLocationData, educationToEdit, resumeId, sectionId, reset]);

  const onDegreeCompleted = (completed: boolean) => {
    if (completed) {
      resetField("endDate");
    }
  };

  const onSubmit = (data: z.infer<typeof AddEducationFormSchema>) => {
    startTransition(async () => {
      const res = educationToEdit?.educations?.length
        ? await updateEducation(data)
        : await addEducation(data);
      if (!res.success) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: res.message,
        });
      } else {
        reset();
        setDialogOpen(false);
        toast({
          variant: "success",
          description: `Education has been ${
            educationToEdit ? "updated" : "added"
          } successfully`,
        });
      }
    });
  };

  return {
    form,
    locations,
    isPending,
    degreeCompletedValue,
    onDegreeCompleted,
    onSubmit,
    isDirty,
  };
}

