"use strict";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { createJobTitle } from "@/actions/jobtitle.actions";
import { JobTitle } from "@prisma/client";
import { AddJobTitleFormSchema } from "@/models/addJobTitleForm.schema";

export function useJobTitleForm(
  editJobTitle: JobTitle | null | undefined,
  reloadJobTitles: () => void,
  setDialogOpen: (open: boolean) => void
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddJobTitleFormSchema>>({
    resolver: zodResolver(AddJobTitleFormSchema),
    defaultValues: {
      label: "",
    },
  });

  const { reset, formState } = form;

  useEffect(() => {
    if (editJobTitle) {
      reset(
        {
          id: editJobTitle?.id,
          label: editJobTitle?.label ?? "",
          createdBy: editJobTitle?.createdBy,
        },
        { keepDefaultValues: true }
      );
    }
  }, [editJobTitle, reset]);

  const onSubmit = (data: z.infer<typeof AddJobTitleFormSchema>) => {
    startTransition(async () => {
      const res = await createJobTitle(data.label.trim());
      if (!res || (res as any).success === false) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: (res as any)?.message || "Failed to create job title.",
        });
      } else {
        reset();
        setDialogOpen(false);
        reloadJobTitles();
        toast({
          variant: "success",
          description: `Job title has been created successfully`,
        });
      }
    });
  };

  return {
    form,
    isPending,
    formState,
    onSubmit,
    reset,
  };
}

















