"use strict";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { ResumeSection } from "@/models/profile.model";
import {
  addResumeSummary,
  updateResumeSummary,
} from "@/actions/profile.actions";
import { AddSummarySectionFormSchema } from "@/models/addSummaryForm.schema";

export function useResumeSummaryForm(
  resumeId: string | undefined,
  summaryToEdit: ResumeSection | null | undefined,
  setDialogOpen: (open: boolean) => void
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddSummarySectionFormSchema>>({
    resolver: zodResolver(AddSummarySectionFormSchema),
    defaultValues: {
      resumeId,
    },
  });

  const { reset, formState } = form;

  useEffect(() => {
    if (summaryToEdit) {
      reset(
        {
          id: summaryToEdit.id,
          sectionTitle: summaryToEdit.sectionTitle,
          sectionType: summaryToEdit.sectionType,
          content: summaryToEdit.summary?.content!,
        },
        {
          keepDefaultValues: true,
        }
      );
    }
  }, [summaryToEdit, reset]);

  const onSubmit = (data: z.infer<typeof AddSummarySectionFormSchema>) => {
    startTransition(async () => {
      const res = summaryToEdit
        ? await updateResumeSummary(data)
        : await addResumeSummary(data);
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
          description: `Summary has been ${
            summaryToEdit ? "updated" : "created"
          } successfully`,
        });
      }
    });
  };

  return {
    form,
    isPending,
    formState,
    onSubmit,
  };
}

















