"use client";

import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { DatePicker } from "../DatePicker";
import { Control } from "react-hook-form";
import { AddExperienceFormSchema } from "@/models/addExperienceForm.schema";
import { z } from "zod";

interface ExperienceDateFieldsProps {
  control: Control<z.infer<typeof AddExperienceFormSchema>>;
  currentJobValue: boolean;
}

export function ExperienceDateFields({
  control,
  currentJobValue,
}: ExperienceDateFieldsProps) {
  return (
    <>
      <div className="flex flex-col">
        <FormField
          control={control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <DatePicker
                field={field}
                presets={false}
                isEnabled={true}
                captionLayout={true}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col">
        <FormField
          control={control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <DatePicker
                field={field}
                presets={false}
                isEnabled={!currentJobValue!}
                captionLayout={true}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

















