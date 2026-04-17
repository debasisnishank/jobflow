"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Combobox } from "../ComboBox";
import { Control } from "react-hook-form";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import { z } from "zod";
import { JOB_TYPES } from "@/models/job.model";

interface JobSource {
  id: string;
  label: string;
  value: string;
}

interface JobFormTypeFieldsProps {
  control: Control<z.infer<typeof AddJobFormSchema>>;
  jobSources: JobSource[];
}

export function JobFormTypeFields({
  control,
  jobSources,
}: JobFormTypeFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-sm font-medium mb-2">Job Type</FormLabel>
            <RadioGroup
              name="type"
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-wrap gap-3"
            >
              {Object.entries(JOB_TYPES).map(([key, value]) => (
                <FormItem
                  key={key}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={key} />
                  </FormControl>
                  <FormLabel className="font-normal text-sm">{value}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="source"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-sm font-medium">Job Source</FormLabel>
            <FormControl>
              <Combobox options={jobSources} field={field} creatable />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

















