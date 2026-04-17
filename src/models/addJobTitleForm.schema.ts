import { z } from "zod";

export const AddJobTitleFormSchema = z.object({
  id: z.string().optional(),
  createdBy: z.string().optional(),
  label: z
    .string({
      required_error: "Job title is required.",
    })
    .min(1, "Job title must be at least 1 character."),
});

















