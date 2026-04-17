"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Combobox } from "../ComboBox";
import { Control } from "react-hook-form";
import { AddEducationFormSchema } from "@/models/AddEductionForm.schema";
import { z } from "zod";
import { JobLocation } from "@/models/job.model";

interface EducationBasicFieldsProps {
  control: Control<z.infer<typeof AddEducationFormSchema>>;
  locations: JobLocation[];
}

export function EducationBasicFields({
  control,
  locations,
}: EducationBasicFieldsProps) {
  return (
    <>
      <div>
        <FormField
          control={control}
          name="institution"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>School</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Stanford" />
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Combobox options={locations!} field={field} creatable />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="degree"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Bachelor's" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="fieldOfStudy"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Field of study</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Computer Science" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

















