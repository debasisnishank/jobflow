"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Control } from "react-hook-form";
import { AddJobLocationFormSchema } from "@/models/addJobLocationForm.schema";
import { z } from "zod";

interface JobLocationFormFieldsProps {
  control: Control<z.infer<typeof AddJobLocationFormSchema>>;
}

export function JobLocationFormFields({ control }: JobLocationFormFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., San Francisco" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="stateProv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., California" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., United States" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}









