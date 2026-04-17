"use strict";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddExperienceFormSchema } from "@/models/addExperienceForm.schema";
import { ResumeSection, WorkExperience } from "@/models/profile.model";

export function useExperienceFormState(
  resumeId: string | undefined,
  sectionId: string | undefined,
  experienceToEdit?: ResumeSection
) {
  const form = useForm<z.infer<typeof AddExperienceFormSchema>>({
    resolver: zodResolver(AddExperienceFormSchema),
    defaultValues: {
      resumeId,
      sectionId,
    },
  });

  const { watch, reset, formState, resetField } = form;
  const currentJobValue = watch("currentJob");
  const isDirty = formState.isDirty;

  useEffect(() => {
    if (experienceToEdit) {
      const experience: WorkExperience =
        experienceToEdit.workExperiences?.at(0)!;
      reset(
        {
          id: experience?.id,
          title: experience?.jobTitle.id,
          company: experience?.Company.id,
          location: experience?.location.id,
          startDate: experience?.startDate,
          endDate: experience?.endDate,
          jobDescription: experience?.description,
          currentJob: !!!experience?.endDate,
        },
        {
          keepDefaultValues: true,
        }
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
  }, [experienceToEdit, reset, resumeId, sectionId]);

  const onCurrentJob = (current: boolean) => {
    if (current) {
      resetField("endDate");
    }
  };

  return {
    form,
    currentJobValue,
    isDirty,
    onCurrentJob,
    reset,
  };
}

















