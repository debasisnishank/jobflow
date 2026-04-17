import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/jpeg", // JPEG
  "image/jpg", // JPG
  "image/png", // PNG
  "image/gif", // GIF
  "image/webp", // WebP
  "image/svg+xml", // SVG
];

export const AddCompanyFormSchema = z.object({
  id: z.string().optional(),
  createdBy: z.string().optional(),
  company: z
    .string({
      required_error: "Company name is required.",
    })
    .min(1),
  logoFile: z
    .union([z.instanceof(File), z.null(), z.undefined()])
    .refine(
      (file) => !file || SUPPORTED_IMAGE_MIME_TYPES.includes(file.type),
      {
        message: "Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed.",
      }
    )
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB",
    })
    .optional(),
  logoUrl: z.string().optional(), // Keep for backward compatibility and storing fileId
  fileId: z.string().optional(), // Store fileId when file is uploaded
});
