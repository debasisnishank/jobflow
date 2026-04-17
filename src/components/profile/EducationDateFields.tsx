"use client";

import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { DatePicker } from "../DatePicker";
import { Control } from "react-hook-form";
import { AddEducationFormSchema } from "@/models/AddEductionForm.schema";
import { z } from "zod";

interface EducationDateFieldsProps {
  control: Control<z.infer<typeof AddEducationFormSchema>>;
  degreeCompletedValue: boolean;
}

export function EducationDateFields({
  control,
  degreeCompletedValue,
}: EducationDateFieldsProps) {
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
                isEnabled={degreeCompletedValue!}
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

















