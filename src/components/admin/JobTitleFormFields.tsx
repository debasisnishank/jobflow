"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Control } from "react-hook-form";
import { AddJobTitleFormSchema } from "@/models/addJobTitleForm.schema";
import { z } from "zod";

interface JobTitleFormFieldsProps {
  control: Control<z.infer<typeof AddJobTitleFormSchema>>;
}

export function JobTitleFormFields({ control }: JobTitleFormFieldsProps) {
  return (
    <FormField
      control={control}
      name="label"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Job Title</FormLabel>
          <FormControl>
            <Input {...field} placeholder="e.g., Software Engineer" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}







