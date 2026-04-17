"use strict";

import { useTransition } from "react";
import { Control } from "react-hook-form";
import { z } from "zod";
import { AddExperienceFormSchema } from "@/models/addExperienceForm.schema";
import { ResumeSection } from "@/models/profile.model";
import { addExperience, updateExperience } from "@/actions/profile.actions";
import { toast } from "@/components/ui/use-toast";

interface UseExperienceFormSubmitProps {
  form: {
    reset: () => void;
  };
  experienceToEdit?: ResumeSection;
  setDialogOpen: (open: boolean) => void;
}

export function useExperienceFormSubmit({
  form,
  experienceToEdit,
  setDialogOpen,
}: UseExperienceFormSubmitProps) {
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof AddExperienceFormSchema>) => {
    startTransition(async () => {
      const res = experienceToEdit?.workExperiences?.length
        ? await updateExperience(data)
        : await addExperience(data);
      if (!res.success) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: res.message,
        });
      } else {
        form.reset();
        setDialogOpen(false);
        toast({
          variant: "success",
          description: `Experience has been ${
            experienceToEdit ? "updated" : "added"
          } successfully`,
        });
      }
    });
  };

  return {
    isPending,
    onSubmit,
  };
}

















