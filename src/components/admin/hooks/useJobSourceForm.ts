"use strict";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { createJobSource } from "@/actions/job.actions";

const schema = z.object({
  label: z
    .string({
      required_error: "Source name is required.",
    })
    .min(2, "Source name must be at least 2 characters.")
    .max(80, "Source name cannot exceed 80 characters."),
});

export function useJobSourceForm(reloadSources: () => Promise<void>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
    },
  });

  const openDialog = () => {
    form.reset();
    setDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(async () => {
      const result = await createJobSource(values.label);
      if (!result?.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result?.message || "Unable to create job source.",
        });
        return;
      }
      toast({
        variant: "success",
        description: "Job source added successfully.",
      });
      await reloadSources();
      setDialogOpen(false);
    });
  };

  return {
    form,
    dialogOpen,
    setDialogOpen,
    isPending,
    openDialog,
    onSubmit,
  };
}

















