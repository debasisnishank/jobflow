"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FileText } from "lucide-react";
import TiptapEditor from "../TiptapEditor";
import { Control } from "react-hook-form";
import { AddActivityFormSchema } from "@/models/addActivityForm.schema";
import { z } from "zod";

interface ActivityDescriptionSectionProps {
  control: Control<z.infer<typeof AddActivityFormSchema>>;
}

export function ActivityDescriptionSection({
  control,
}: ActivityDescriptionSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Additional Details</h3>
      </div>
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel id="job-description-label" className="text-sm font-medium">
              Description (Optional)
            </FormLabel>
            <FormControl>
              <TiptapEditor field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

















