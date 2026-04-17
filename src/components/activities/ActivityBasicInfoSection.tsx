"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Combobox } from "../ComboBox";
import { FileText, Tag } from "lucide-react";
import { Control } from "react-hook-form";
import { AddActivityFormSchema } from "@/models/addActivityForm.schema";
import { z } from "zod";
import { ActivityType } from "@/models/activity.model";

interface ActivityBasicInfoSectionProps {
  control: Control<z.infer<typeof AddActivityFormSchema>>;
  activityTypes: ActivityType[];
}

export function ActivityBasicInfoSection({
  control,
  activityTypes,
}: ActivityBasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="activityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                Activity Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Job Search, Learning React, etc."
                  className="border-border/60"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="activityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" />
                Activity Type
              </FormLabel>
              <FormControl>
                <Combobox options={activityTypes} field={field} creatable />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

















