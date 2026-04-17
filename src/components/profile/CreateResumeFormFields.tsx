"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Control, FieldErrors } from "react-hook-form";
import { CreateResumeFormSchema } from "@/models/createResumeForm.schema";
import { z } from "zod";
import { FileText, Upload as UploadIcon } from "lucide-react";

interface CreateResumeFormFieldsProps {
  control: Control<z.infer<typeof CreateResumeFormSchema>>;
  errors: FieldErrors<z.infer<typeof CreateResumeFormSchema>>;
}

export function CreateResumeFormFields({
  control,
  errors,
}: CreateResumeFormFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Resume Title
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g., Software Engineer Resume 2024"
                className="h-11"
              />
            </FormControl>
            <FormDescription className="text-xs">
              Give your resume a descriptive name to easily identify it later
            </FormDescription>
            <FormMessage>
              {errors.title && (
                <span className="text-sm text-destructive">{errors.title.message}</span>
              )}
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium flex items-center gap-2">
              <UploadIcon className="h-4 w-4 text-muted-foreground" />
              Upload Resume File
              <span className="text-xs font-normal text-muted-foreground ml-1">(Optional)</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0] || null);
                  }}
                  className="h-11 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
                />
              </div>
            </FormControl>
            <FormDescription className="text-xs">
              Supported formats: PDF, DOC, DOCX. Maximum file size depends on your plan.
            </FormDescription>
            <FormMessage>
              {errors.file?.message && (
                <span className="text-sm text-destructive">{errors.file.message}</span>
              )}
            </FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}









