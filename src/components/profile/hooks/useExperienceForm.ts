"use client";

import { useEffect } from "react";
import { ResumeSection } from "@/models/profile.model";
import { useExperienceDataLoader } from "./useExperienceDataLoader";
import { useExperienceFormState } from "./useExperienceFormState";
import { useExperienceFormSubmit } from "./useExperienceFormSubmit";

interface UseExperienceFormProps {
  resumeId: string | undefined;
  sectionId: string | undefined;
  experienceToEdit?: ResumeSection;
  setDialogOpen: (e: boolean) => void;
}

export function useExperienceForm({
  resumeId,
  sectionId,
  experienceToEdit,
  setDialogOpen,
}: UseExperienceFormProps) {
  const { companies, locations, jobTitles, getTitleCompanyAndLocationData } =
    useExperienceDataLoader();

  const { form, currentJobValue, isDirty, onCurrentJob, reset } =
    useExperienceFormState(resumeId, sectionId, experienceToEdit);

  const { isPending, onSubmit } = useExperienceFormSubmit({
    form,
    experienceToEdit,
    setDialogOpen,
  });

  useEffect(() => {
    getTitleCompanyAndLocationData();
  }, [getTitleCompanyAndLocationData]);

  return {
    form,
    companies,
    locations,
    jobTitles,
    isPending,
    currentJobValue,
    onCurrentJob,
    onSubmit,
    isDirty,
  };
}

