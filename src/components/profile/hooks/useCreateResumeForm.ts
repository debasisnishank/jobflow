"use strict";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Resume } from "@/models/profile.model";
import { CreateResumeFormSchema } from "@/models/createResumeForm.schema";

export function useCreateResumeForm(
  resumeToEdit: Resume | null | undefined,
  setResumeDialogOpen: (open: boolean) => void,
  reloadResumes: () => void,
  setNewResumeId: (id: string) => void
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateResumeFormSchema>>({
    resolver: zodResolver(CreateResumeFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });

  const {
    reset,
    formState: { errors, isValid },
  } = form;

  useEffect(() => {
    reset({
      id: resumeToEdit?.id ?? undefined,
      title: resumeToEdit?.title ?? "",
      fileId: resumeToEdit?.FileId ?? undefined,
    });
  }, [resumeToEdit, reset]);

  const onSubmit = (data: z.infer<typeof CreateResumeFormSchema>) => {
    const formData = new FormData();
    formData.append("file", data.file as File);
    formData.append("title", data.title);
    if (resumeToEdit) {
      formData.append("id", data.id as string);
      if (resumeToEdit.FileId) {
        formData.append("fileId", data.fileId as string);
      }
    }

    startTransition(async () => {
      const res = await fetch("/api/profile/resume", {
        method: "POST",
        body: formData,
      });
      const response = await res.json();
      if (!response.success) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: response?.message,
        });
      } else {
        reset();
        setResumeDialogOpen(false);
        reloadResumes();
        if (response.data?.id) {
          setNewResumeId(response.data?.id);
        }
        toast({
          variant: "success",
          description: `Resume title has been ${
            resumeToEdit ? "updated" : "created"
          } successfully`,
        });
      }
    });
  };

  return {
    form,
    isPending,
    errors,
    isValid,
    onSubmit,
  };
}

















