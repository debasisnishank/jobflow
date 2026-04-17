"use strict";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { createLocation } from "@/actions/job.actions";
import { JobLocation } from "@/models/job.model";
import { AddJobLocationFormSchema } from "@/models/addJobLocationForm.schema";

export function useJobLocationForm(
  editJobLocation: JobLocation | null | undefined,
  reloadJobLocations: () => void,
  setDialogOpen: (open: boolean) => void
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddJobLocationFormSchema>>({
    resolver: zodResolver(AddJobLocationFormSchema),
    defaultValues: {
      label: "",
      stateProv: "",
      country: "",
    },
  });

  const { reset, formState } = form;

  useEffect(() => {
    if (editJobLocation) {
      reset(
        {
          id: editJobLocation?.id,
          label: editJobLocation?.label ?? "",
          createdBy: editJobLocation?.createdBy,
          stateProv: editJobLocation?.stateProv ?? "",
          country: editJobLocation?.country ?? "",
        },
        { keepDefaultValues: true }
      );
    }
  }, [editJobLocation, reset]);

  const onSubmit = (data: z.infer<typeof AddJobLocationFormSchema>) => {
    startTransition(async () => {
      const res = await createLocation(
        data.label.trim(),
        data.stateProv,
        data.country
      );
      if (!res?.success) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: res?.message || "Failed to create job location.",
        });
      } else {
        reset();
        setDialogOpen(false);
        reloadJobLocations();
        toast({
          variant: "success",
          description: `Job location has been created successfully`,
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

