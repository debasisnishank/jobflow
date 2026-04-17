import { z } from "zod";

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});










