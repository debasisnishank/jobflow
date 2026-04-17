"use strict";
"use server";

import prisma from "@/lib/db";
import { handleError, ErrorResponse } from "@/lib/utils";
import { getCurrentUser } from "@/utils/user.utils";
import { revalidatePath } from "next/cache";
import { DatabaseError, AuthenticationError, ValidationError } from "@/lib/errors";
import { CoverLetter, CoverLetterTemplate, CoverLetterFormData } from "@/models/coverLetter.model";

export interface SuccessResponse<T> {
  success: true;
  data?: T;
  coverLetter?: T;
  template?: T;
  coverLetters?: T[];
  templates?: T[];
}

export type ActionResponse<T> = SuccessResponse<T> | ErrorResponse;

export const getCoverLettersByJobId = async (
  jobId: string
): Promise<ActionResponse<CoverLetter>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getCoverLettersByJobId" },
      });
    }

    if (!jobId) {
      throw new ValidationError("Job ID is required", {
        context: { jobId },
      });
    }

    // Verify job belongs to user
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        userId: user.id,
      },
    });

    if (!job) {
      throw new ValidationError("Job not found or access denied", {
        context: { jobId, userId: user.id },
      });
    }

    // Check if the table exists by attempting to query it
    // If it doesn't exist, return empty array instead of throwing error
    try {
      const coverLetters = await prisma.coverLetter.findMany({
        where: {
          jobId,
        },
        include: {
          template: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        success: true,
        coverLetters: coverLetters as CoverLetter[],
      };
    } catch (dbError: any) {
      // If table doesn't exist or there's a schema error, return empty array
      if (
        dbError?.code === "P2001" ||
        dbError?.message?.includes("does not exist") ||
        dbError?.message?.includes("Unknown model")
      ) {
        return {
          success: true,
          coverLetters: [] as CoverLetter[],
        };
      }
      throw dbError;
    }
  } catch (error) {
    const msg = "Failed to fetch cover letters.";
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    // If it's a database schema error, return empty array instead
    if (
      error instanceof Error &&
      (error.message.includes("does not exist") ||
        error.message.includes("Unknown model") ||
        error.message.includes("P2001"))
    ) {
      return {
        success: true,
        coverLetters: [] as CoverLetter[],
      };
    }
    throw new DatabaseError(msg, {
      context: { jobId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

export const createCoverLetter = async (
  jobId: string,
  data: CoverLetterFormData
): Promise<ActionResponse<CoverLetter>> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated", {
      context: { function: "createCoverLetter" },
    });
  }

  if (!jobId || !data.title || !data.content) {
    throw new ValidationError("Job ID, title, and content are required", {
      context: { jobId, hasTitle: !!data.title, hasContent: !!data.content },
    });
  }

  try {
    // Verify job belongs to user
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        userId: user.id,
      },
    });

    if (!job) {
      throw new ValidationError("Job not found or access denied", {
        context: { jobId, userId: user.id },
      });
    }

    // Get the highest version number for this job
    let nextVersion = 1;
    try {
      const latestCoverLetter = await prisma.coverLetter.findFirst({
        where: {
          jobId,
        },
        orderBy: {
          version: "desc",
        },
      });
      nextVersion = latestCoverLetter ? latestCoverLetter.version + 1 : 1;
    } catch (dbError: any) {
      // If table doesn't exist, start with version 1
      if (
        dbError?.code === "P2001" ||
        dbError?.message?.includes("does not exist") ||
        dbError?.message?.includes("Unknown model")
      ) {
        nextVersion = 1;
      } else {
        throw dbError;
      }
    }

    // Set all existing cover letters for this job to not current
    try {
      await prisma.coverLetter.updateMany({
        where: {
          jobId,
          isCurrent: true,
        },
        data: {
          isCurrent: false,
        },
      });
    } catch (dbError: any) {
      // If table doesn't exist, continue - this is the first cover letter
      if (
        !(
          dbError?.code === "P2001" ||
          dbError?.message?.includes("does not exist") ||
          dbError?.message?.includes("Unknown model")
        )
      ) {
        throw dbError;
      }
    }

    // Create new cover letter
    const coverLetter = await prisma.coverLetter.create({
      data: {
        jobId,
        templateId: data.templateId || null,
        title: data.title,
        content: data.content,
        version: nextVersion,
        isCurrent: true,
      },
      include: {
        template: true,
      },
    });

    revalidatePath(`/dashboard/myjobs/${jobId}`);

    return {
      success: true,
      coverLetter: coverLetter as CoverLetter,
    };
  } catch (error) {
    const msg = "Failed to create cover letter.";
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    
    // Check if it's a database schema error
    if (
      error instanceof Error &&
      (error.message.includes("does not exist") ||
        error.message.includes("Unknown model") ||
        error.message.includes("P2001"))
    ) {
      throw new DatabaseError(
        "Cover letter table does not exist. Please run: npx prisma generate && npx prisma db push",
        {
          context: { jobId },
          originalError: error,
        }
      );
    }
    
    throw new DatabaseError(msg, {
      context: { jobId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

export const updateCoverLetter = async (
  coverLetterId: string,
  data: Partial<CoverLetterFormData>
): Promise<ActionResponse<CoverLetter>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateCoverLetter" },
      });
    }

    // Verify cover letter belongs to user's job
    const existingCoverLetter = await prisma.coverLetter.findFirst({
      where: {
        id: coverLetterId,
        job: {
          userId: user.id,
        },
      },
    });

    if (!existingCoverLetter) {
      throw new ValidationError("Cover letter not found or access denied", {
        context: { coverLetterId, userId: user.id },
      });
    }

    const coverLetter = await prisma.coverLetter.update({
      where: {
        id: coverLetterId,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.templateId !== undefined && { templateId: data.templateId || null }),
      },
      include: {
        template: true,
      },
    });

    revalidatePath(`/dashboard/myjobs/${coverLetter.jobId}`);

    return {
      success: true,
      coverLetter: coverLetter as CoverLetter,
    };
  } catch (error) {
    const msg = "Failed to update cover letter.";
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    throw new DatabaseError(msg, {
      context: { coverLetterId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

export const setCoverLetterAsCurrent = async (
  coverLetterId: string
): Promise<ActionResponse<CoverLetter>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "setCoverLetterAsCurrent" },
      });
    }

    // Verify cover letter belongs to user's job
    const existingCoverLetter = await prisma.coverLetter.findFirst({
      where: {
        id: coverLetterId,
        job: {
          userId: user.id,
        },
      },
    });

    if (!existingCoverLetter) {
      throw new ValidationError("Cover letter not found or access denied", {
        context: { coverLetterId, userId: user.id },
      });
    }

    // Set all cover letters for this job to not current
    await prisma.coverLetter.updateMany({
      where: {
        jobId: existingCoverLetter.jobId,
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });

    // Set this cover letter as current
    const coverLetter = await prisma.coverLetter.update({
      where: {
        id: coverLetterId,
      },
      data: {
        isCurrent: true,
      },
      include: {
        template: true,
      },
    });

    revalidatePath(`/dashboard/myjobs/${coverLetter.jobId}`);

    return {
      success: true,
      coverLetter: coverLetter as CoverLetter,
    };
  } catch (error) {
    const msg = "Failed to set cover letter as current.";
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    throw new DatabaseError(msg, {
      context: { coverLetterId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

export const deleteCoverLetter = async (
  coverLetterId: string
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "deleteCoverLetter" },
      });
    }

    // Verify cover letter belongs to user's job
    const existingCoverLetter = await prisma.coverLetter.findFirst({
      where: {
        id: coverLetterId,
        job: {
          userId: user.id,
        },
      },
    });

    if (!existingCoverLetter) {
      throw new ValidationError("Cover letter not found or access denied", {
        context: { coverLetterId, userId: user.id },
      });
    }

    await prisma.coverLetter.delete({
      where: {
        id: coverLetterId,
      },
    });

    revalidatePath(`/dashboard/myjobs/${existingCoverLetter.jobId}`);

    return {
      success: true,
      data: { id: coverLetterId },
    };
  } catch (error) {
    const msg = "Failed to delete cover letter.";
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    throw new DatabaseError(msg, {
      context: { coverLetterId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

// Template Actions
export const getCoverLetterTemplates = async (): Promise<
  ActionResponse<CoverLetterTemplate>
> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated", {
      context: { function: "getCoverLetterTemplates" },
    });
  }

  try {
    // Check if the table exists by attempting to query it
    // If it doesn't exist, return empty array instead of throwing error
    try {
      const templates = await prisma.coverLetterTemplate.findMany({
        where: {
          userId: user.id,
        },
        orderBy: [
          { isDefault: "desc" },
          { createdAt: "desc" },
        ],
      });

      return {
        success: true,
        templates: templates as CoverLetterTemplate[],
      };
    } catch (dbError: any) {
      // If table doesn't exist or there's a schema error, return empty array
      if (
        dbError?.code === "P2001" ||
        dbError?.message?.includes("does not exist") ||
        dbError?.message?.includes("Unknown model")
      ) {
        return {
          success: true,
          templates: [] as CoverLetterTemplate[],
        };
      }
      throw dbError;
    }
  } catch (error) {
    const msg = "Failed to fetch cover letter templates.";
    if (
      error instanceof AuthenticationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    // If it's a database schema error, return empty array instead
    if (
      error instanceof Error &&
      (error.message.includes("does not exist") ||
        error.message.includes("Unknown model") ||
        error.message.includes("P2001"))
    ) {
      return {
        success: true,
        templates: [] as CoverLetterTemplate[],
      };
    }
    throw new DatabaseError(msg, {
      context: { userId: user.id },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

export const createCoverLetterTemplate = async (
  data: Omit<CoverLetterTemplate, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<ActionResponse<CoverLetterTemplate>> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated", {
      context: { function: "createCoverLetterTemplate" },
    });
  }

  try {

    if (!data.title || !data.content) {
      throw new ValidationError("Title and content are required", {
        context: { hasTitle: !!data.title, hasContent: !!data.content },
      });
    }

    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await prisma.coverLetterTemplate.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const template = await prisma.coverLetterTemplate.create({
      data: {
        userId: user.id,
        title: data.title,
        content: data.content,
        isDefault: data.isDefault || false,
      },
    });

    return {
      success: true,
      template: template as CoverLetterTemplate,
    };
  } catch (error) {
    const msg = "Failed to create cover letter template.";
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    throw new DatabaseError(msg, {
      context: { userId: user.id },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

export const updateCoverLetterTemplate = async (
  templateId: string,
  data: Partial<Omit<CoverLetterTemplate, "id" | "userId" | "createdAt" | "updatedAt">>
): Promise<ActionResponse<CoverLetterTemplate>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateCoverLetterTemplate" },
      });
    }

    // Verify template belongs to user
    const existingTemplate = await prisma.coverLetterTemplate.findFirst({
      where: {
        id: templateId,
        userId: user.id,
      },
    });

    if (!existingTemplate) {
      throw new ValidationError("Template not found or access denied", {
        context: { templateId, userId: user.id },
      });
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.coverLetterTemplate.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          id: { not: templateId },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const template = await prisma.coverLetterTemplate.update({
      where: {
        id: templateId,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
      },
    });

    return {
      success: true,
      template: template as CoverLetterTemplate,
    };
  } catch (error) {
    const msg = "Failed to update cover letter template.";
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    throw new DatabaseError(msg, {
      context: { templateId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

export const deleteCoverLetterTemplate = async (
  templateId: string
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "deleteCoverLetterTemplate" },
      });
    }

    // Verify template belongs to user
    const existingTemplate = await prisma.coverLetterTemplate.findFirst({
      where: {
        id: templateId,
        userId: user.id,
      },
    });

    if (!existingTemplate) {
      throw new ValidationError("Template not found or access denied", {
        context: { templateId, userId: user.id },
      });
    }

    await prisma.coverLetterTemplate.delete({
      where: {
        id: templateId,
      },
    });

    return {
      success: true,
      data: { id: templateId },
    };
  } catch (error) {
    const msg = "Failed to delete cover letter template.";
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }
    throw new DatabaseError(msg, {
      context: { templateId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

