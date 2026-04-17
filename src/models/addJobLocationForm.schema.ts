import { z } from "zod";

export const AddJobLocationFormSchema = z.object({
  id: z.string().optional(),
  createdBy: z.string().optional(),
  label: z
    .string({
      required_error: "Location name is required.",
    })
    .min(1, "Location name must be at least 1 character."),
  stateProv: z.string().optional(),
  country: z.string().optional(),
});

















