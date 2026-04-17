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
import { AddCompanyFormSchema } from "@/models/addCompanyForm.schema";
import { z } from "zod";

interface CompanyFormFieldsProps {
  control: Control<z.infer<typeof AddCompanyFormSchema>>;
}

export function CompanyFormFields({ control }: CompanyFormFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., Acme Corporation" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="logoFile"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Company Logo (Optional)</FormLabel>
            <FormControl>
              <Input
                {...fieldProps}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={(e) => {
                  onChange(e.target.files?.[0] || null);
                }}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Upload a logo image (JPEG, PNG, GIF, WebP, or SVG). Max size: 5MB
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

