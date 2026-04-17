"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DatePicker } from "../DatePicker";
import { Clock, Calendar, AlertCircle } from "lucide-react";
import { Control } from "react-hook-form";
import { AddActivityFormSchema } from "@/models/addActivityForm.schema";
import { z } from "zod";

interface ActivityTimeFieldsProps {
  control: Control<z.infer<typeof AddActivityFormSchema>>;
}

export function ActivityTimeFields({ control }: ActivityTimeFieldsProps) {
  const form = control as any;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Start Date
            </FormLabel>
            <DatePicker field={field} presets={false} isEnabled={true} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Start Time
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g., 09:00 AM"
                className="border-border/60"
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              Format: hh:mm AM/PM (e.g., 09:30 AM)
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="endDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              End Date
            </FormLabel>
            <DatePicker field={field} presets={false} isEnabled={true} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="endTime"
        render={({ field }) => {
          const error = form.formState?.errors?.endTime;
          const hasDurationError = error?.message?.includes("cannot exceed");
          return (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                End Time
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., 05:00 PM"
                  className={`border-border/60 ${
                    hasDurationError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Format: hh:mm AM/PM (e.g., 05:30 PM)
              </p>
              {hasDurationError && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800 dark:text-red-200">
                      {error.message}
                    </p>
                  </div>
                </div>
              )}
              {!hasDurationError && <FormMessage />}
            </FormItem>
          );
        }}
      />
    </div>
  );
}

















