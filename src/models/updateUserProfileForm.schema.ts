import { z } from "zod";

export const UpdateUserProfileFormSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required.",
    })
    .min(1, "Name must be at least 1 character.")
    .max(100, "Name must be less than 100 characters."),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email("Please enter a valid email address.")
    .min(1, "Email is required."),
});

















