"use client";

import { FileText } from "lucide-react";
import { Control } from "react-hook-form";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import { z } from "zod";
import { JobFormBasicFields } from "./JobFormBasicFields";
import { JobFormTypeFields } from "./JobFormTypeFields";

interface JobFormRoleDetailsProps {
  control: Control<z.infer<typeof AddJobFormSchema>>;
  jobTitles: any[];
  companies: any[];
  locations: any[];
  jobSources: any[];
}

export function JobFormRoleDetails({
  control,
  jobTitles,
  companies,
  locations,
  jobSources,
}: JobFormRoleDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <FileText className="h-4 w-4 text-primary" />
        Role details
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JobFormBasicFields
          control={control}
          jobTitles={jobTitles}
          companies={companies}
          locations={locations}
        />
        <JobFormTypeFields control={control} jobSources={jobSources} />
      </div>
    </div>
  );
}

