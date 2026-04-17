"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";
import { DatePicker } from "../DatePicker";
import SelectFormCtrl from "../Select";
import { ClipboardList } from "lucide-react";
import { Control } from "react-hook-form";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import { z } from "zod";
import { SALARY_RANGES } from "@/lib/data/salaryRangeData";
import { CURRENCIES } from "@/lib/data/currencyData";
import { JobStatus } from "@/models/job.model";

interface JobFormApplicationTrackingProps {
  control: Control<z.infer<typeof AddJobFormSchema>>;
  appliedValue: boolean;
  statusesArray: JobStatus[];
  onAppliedChange: (applied: boolean) => void;
}

export function JobFormApplicationTracking({
  control,
  appliedValue,
  statusesArray,
  onAppliedChange,
}: JobFormApplicationTrackingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <ClipboardList className="h-4 w-4 text-primary" />
        Application tracking
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-md border border-border/60 px-4 py-3">
          <FormField
            control={control}
            name="applied"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-y-0">
                <FormControl>
                  <Switch
                    id="applied-switch"
                    checked={field.value}
                    onCheckedChange={(a) => {
                      field.onChange(a);
                      onAppliedChange(a);
                    }}
                  />
                </FormControl>
                <FormLabel htmlFor="applied-switch" className="ml-3 text-sm font-medium">
                  {field.value ? "Application submitted" : "Not applied yet"}
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col [&>button]:capitalize">
              <FormLabel className="text-sm font-medium">Status</FormLabel>
              <SelectFormCtrl label="Job Status" options={statusesArray} field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="dateApplied"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-medium">Date Applied</FormLabel>
              <DatePicker field={field} presets={false} isEnabled={appliedValue} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-medium">Follow-up Reminder</FormLabel>
              <DatePicker field={field} presets isEnabled />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="salaryCurrency"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-medium">Currency</FormLabel>
              <FormControl>
                <SelectFormCtrl label="Currency" options={CURRENCIES} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="salaryRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-medium">Salary Range</FormLabel>
              <FormControl>
                <SelectFormCtrl label="Salary Range" options={SALARY_RANGES} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}









