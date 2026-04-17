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
import { AddSummarySectionFormSchema } from "@/models/addSummaryForm.schema";
import { z } from "zod";
import TiptapEditor from "../TiptapEditor";

interface ResumeSummaryFormFieldsProps {
  control: Control<z.infer<typeof AddSummarySectionFormSchema>>;
}

export function ResumeSummaryFormFields({
  control,
}: ResumeSummaryFormFieldsProps) {
  return (
    <>
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="sectionTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Summary" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Resume Summary</FormLabel>
              <FormControl>
                <TiptapEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

















