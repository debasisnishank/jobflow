"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import TiptapEditor from "../TiptapEditor";
import { Control } from "react-hook-form";
import { AddExperienceFormSchema } from "@/models/addExperienceForm.schema";
import { z } from "zod";
import { Company, JobLocation, JobTitle } from "@/models/job.model";
import { ExperienceBasicFields } from "./ExperienceBasicFields";
import { ExperienceDateFields } from "./ExperienceDateFields";

interface ExperienceFormFieldsProps {
  control: Control<z.infer<typeof AddExperienceFormSchema>>;
  jobTitles: JobTitle[];
  companies: Company[];
  locations: JobLocation[];
  currentJobValue: boolean;
  sectionId?: string;
  onCurrentJob: (current: boolean) => void;
}

export function ExperienceFormFields({
  control,
  jobTitles,
  companies,
  locations,
  currentJobValue,
  sectionId,
  onCurrentJob,
}: ExperienceFormFieldsProps) {
  return (
    <>
      {!sectionId && (
        <>
          <div className="md:col-span-2">
            <FormField
              control={control}
              name="sectionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Experience" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <hr className="md:col-span-2" />
        </>
      )}

      <ExperienceBasicFields
        control={control}
        jobTitles={jobTitles}
        companies={companies}
        locations={locations}
      />
      <ExperienceDateFields
        control={control}
        currentJobValue={currentJobValue}
      />
      <div className="flex items-center">
        <FormField
          control={control}
          name="currentJob"
          render={({ field }) => (
            <FormItem className="flex flex-row">
              <Switch
                checked={field.value}
                onCheckedChange={(c) => {
                  field.onChange(c);
                  onCurrentJob(c);
                }}
              />
              <FormLabel className="flex items-center ml-4 mb-2">
                {field.value ? "Current Job" : "Job Ended"}
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:col-span-2">
        <FormField
          control={control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Job Description</FormLabel>
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

