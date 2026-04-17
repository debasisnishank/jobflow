"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Combobox } from "../ComboBox";
import { LinkIcon, FileText, Building2, MapPin } from "lucide-react";
import { Control } from "react-hook-form";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import { z } from "zod";

interface JobFormBasicFieldsProps {
  control: Control<z.infer<typeof AddJobFormSchema>>;
  jobTitles: any[];
  companies: any[];
  locations: any[];
}

export function JobFormBasicFields({
  control,
  jobTitles,
  companies,
  locations,
}: JobFormBasicFieldsProps) {
  return (
    <>
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="jobUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <LinkIcon className="h-3.5 w-3.5 text-primary" />
                Job URL
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://company.com/careers/open-role"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Paste the public link to the job posting for quick access.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Job Title
            </FormLabel>
            <FormControl>
              <Combobox options={jobTitles} field={field} creatable />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              Company
            </FormLabel>
            <FormControl>
              <Combobox options={companies} field={field} creatable />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Job Location
            </FormLabel>
            <FormControl>
              <Combobox options={locations} field={field} creatable />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

















