"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Combobox } from "../ComboBox";
import { Control } from "react-hook-form";
import { AddExperienceFormSchema } from "@/models/addExperienceForm.schema";
import { z } from "zod";
import { Company, JobLocation, JobTitle } from "@/models/job.model";

interface ExperienceBasicFieldsProps {
  control: Control<z.infer<typeof AddExperienceFormSchema>>;
  jobTitles: JobTitle[];
  companies: Company[];
  locations: JobLocation[];
}

export function ExperienceBasicFields({
  control,
  jobTitles,
  companies,
  locations,
}: ExperienceBasicFieldsProps) {
  return (
    <>
      <div>
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Combobox options={jobTitles} field={field} creatable />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="company"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Combobox options={companies} field={field} creatable />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Job Location</FormLabel>
              <FormControl>
                <Combobox options={locations!} field={field} creatable />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

















