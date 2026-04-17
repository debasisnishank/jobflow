"use strict";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { addCompany, updateCompany } from "@/actions/company.actions";
import { Company } from "@/models/job.model";
import { AddCompanyFormSchema } from "@/models/addCompanyForm.schema";

export function useCompanyForm(
  editCompany: Company | null | undefined,
  reloadCompanies: () => void,
  setDialogOpen: (open: boolean) => void
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddCompanyFormSchema>>({
    resolver: zodResolver(AddCompanyFormSchema),
    defaultValues: {
      company: "",
      logoFile: undefined,
      logoUrl: "",
      fileId: undefined,
    },
  });

  const { reset, formState } = form;

  useEffect(() => {
    if (editCompany) {
      // Extract fileId from logoUrl if it's an API endpoint
      let existingFileId: string | undefined = undefined;
      if (editCompany.logoUrl?.includes("/api/company/logo?fileId=")) {
        const urlParams = new URLSearchParams(
          editCompany.logoUrl.split("?")[1]
        );
        existingFileId = urlParams.get("fileId") || undefined;
      }

      reset(
        {
          id: editCompany?.id,
          company: editCompany?.label ?? "",
          createdBy: editCompany?.createdBy,
          logoUrl: editCompany?.logoUrl ?? "",
          logoFile: undefined,
          fileId: existingFileId,
        },
        { keepDefaultValues: true }
      );
    }
  }, [editCompany, reset]);

  const onSubmit = (data: z.infer<typeof AddCompanyFormSchema>) => {
    startTransition(async () => {
      try {
        let fileId: string | undefined = data.fileId;

        // If a new file is uploaded, upload it first
        if (data.logoFile && data.logoFile instanceof File) {
          const formData = new FormData();
          formData.append("file", data.logoFile);
          if (editCompany?.id) {
            formData.append("companyId", editCompany.id);
          }
          // Pass existing fileId to delete old file when updating
          if (data.fileId) {
            formData.append("fileId", data.fileId);
          }

          const uploadResponse = await fetch("/api/company/logo", {
            method: "POST",
            body: formData,
          });

          const uploadResult = await uploadResponse.json();

          if (!uploadResult.success) {
            toast({
              variant: "destructive",
              title: "Error!",
              description: uploadResult.error || "Failed to upload logo",
            });
            return;
          }

          fileId = uploadResult.data.fileId;
        }

        // If no new file was uploaded, keep the existing logoUrl
        // If a new file was uploaded, fileId will be set and logoUrl will be constructed in the action
        const payload = {
          id: data.id,
          company: data.company,
          createdBy: data.createdBy,
          logoUrl: fileId ? "" : data.logoUrl ?? undefined, // Clear logoUrl if new file uploaded, otherwise keep existing
          fileId: fileId,
        };

        const res = editCompany
          ? await updateCompany(payload)
          : await addCompany(payload);

        if (!res?.success) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: res?.message,
          });
        } else {
          reset();
          setDialogOpen(false);
          reloadCompanies();
          toast({
            variant: "success",
            description: `Company has been ${
              editCompany ? "updated" : "created"
            } successfully`,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error!",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
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


