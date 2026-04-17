"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import TiptapEditor from "../TiptapEditor";
import { Control } from "react-hook-form";
import { AddEducationFormSchema } from "@/models/AddEductionForm.schema";
import { z } from "zod";
import { JobLocation } from "@/models/job.model";
import { EducationBasicFields } from "./EducationBasicFields";
import { EducationDateFields } from "./EducationDateFields";

interface EducationFormFieldsProps {
  control: Control<z.infer<typeof AddEducationFormSchema>>;
  locations: JobLocation[];
  degreeCompletedValue: boolean;
  sectionId?: string;
  onDegreeCompleted: (completed: boolean) => void;
}

export function EducationFormFields({
  control,
  locations,
  degreeCompletedValue,
  sectionId,
  onDegreeCompleted,
}: EducationFormFieldsProps) {
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
                    <Input {...field} placeholder="Ex: Education" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <hr className="md:col-span-2" />
        </>
      )}

      <EducationBasicFields control={control} locations={locations} />
      <EducationDateFields
        control={control}
        degreeCompletedValue={degreeCompletedValue}
      />

      <div className="flex items-center">
        <FormField
          control={control}
          name="degreeCompleted"
          render={({ field }) => (
            <FormItem className="flex flex-row">
              <Switch
                checked={field.value}
                onCheckedChange={(c) => {
                  field.onChange(c);
                  onDegreeCompleted(c);
                }}
              />
              <FormLabel className="flex items-center ml-4 mb-2">
                {field.value ? "Degree Completed" : "Currently Studying"}
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:col-span-2">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Description</FormLabel>
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

