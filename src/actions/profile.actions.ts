"use strict";
"use server";
import prisma from "@/lib/db";
import { handleError } from "@/lib/utils";
import { AddEducationFormSchema } from "@/models/AddEductionForm.schema";
import { AddContactInfoFormSchema } from "@/models/addContactInfoForm.schema";
import { AddExperienceFormSchema } from "@/models/addExperienceForm.schema";
import { AddSummarySectionFormSchema } from "@/models/addSummaryForm.schema";
import { CreateResumeFormSchema } from "@/models/createResumeForm.schema";
import { ResumeSection, SectionType, Summary } from "@/models/profile.model";
import { getCurrentUser } from "@/utils/user.utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AuthenticationError, ValidationError } from "@/lib/errors";

export const getResumeList = async (
  page = 1,
  limit = 15
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getResumeList" },
      });
    }
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.resume.findMany({
        where: {
          profile: {
            userId: user.id,
          },
        },
        skip,
        take: limit,
        select: {
          id: true,
          profileId: true,
          FileId: true,
          createdAt: true,
          updatedAt: true,
          title: true,
          template: true,
          primaryColor: true,
          atsScore: true,
          aiGenerated: true,
          ResumeSections: {
            select: {
              id: true,
            },
          },
          Skills: {
            select: {
              id: true,
            },
          },
          ContactInfo: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              Job: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.resume.count({
        where: {
          profile: {
            userId: user.id,
          },
        },
      }),
    ]);
    return { data, total, success: true };
  } catch (error) {
    const msg = "Failed to get resume list.";
    return handleError(error, msg);
  }
};

export const getResumeById = async (
  resumeId: string
): Promise<any | undefined> => {
  try {
    if (!resumeId) {
      throw new ValidationError("Please provide resume id", {
        context: { function: "getResumeById" },
      });
    }
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getResumeById" },
      });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        profile: {
          userId: user.id,
        },
      },
      include: {
        ContactInfo: true,
        File: true,
        Skills: true,
        ResumeSections: {
          include: {
            summary: true,
            workExperiences: {
              include: {
                jobTitle: true,
                Company: true,
                location: true,
              },
            },
            educations: {
              include: {
                location: true,
              },
            },
            licenseOrCertifications: true,
            others: true,
          },
        },
      },
    });

    if (!resume) {
      throw new ValidationError("Resume not found or access denied", {
        context: { function: "getResumeById", resumeId, userId: user.id },
      });
    }

    return resume;
  } catch (error) {
    // Re-throw authentication and validation errors so they can be handled properly
    if (error instanceof AuthenticationError || error instanceof ValidationError) {
      throw error;
    }
    const msg = "Failed to get resume.";
    return handleError(error, msg);
  }
};

export const addContactInfo = async (
  data: z.infer<typeof AddContactInfoFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "addContactInfo" },
      });
    }

    // Verify resume ownership before updating
    const resume = await prisma.resume.findFirst({
      where: {
        id: data.resumeId,
        profile: {
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!resume) {
      throw new AuthenticationError("Resume not found or access denied", {
        context: { function: "addContactInfo", resumeId: data.resumeId, userId: user.id },
      });
    }

    const res = await prisma.resume.update({
      where: {
        id: data.resumeId,
      },
      data: {
        ContactInfo: {
          connectOrCreate: {
            where: { resumeId: data.resumeId },
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              headline: data.headline,
              email: data.email!,
              phone: data.phone!,
              address: data.address,
            },
          },
        },
      },
    });
    revalidatePath("/dashboard/profile/resume");
    return { data: res, success: true };
  } catch (error) {
    const msg = "Failed to create contact info.";
    return handleError(error, msg);
  }
};

export const updateContactInfo = async (
  data: z.infer<typeof AddContactInfoFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateContactInfo" },
      });
    }

    // Verify contact info ownership through resume -> profile -> userId
    const contactInfo = await prisma.contactInfo.findFirst({
      where: {
        id: data.id,
        resume: {
          profile: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!contactInfo) {
      throw new AuthenticationError("Contact info not found or access denied", {
        context: { function: "updateContactInfo", contactInfoId: data.id, userId: user.id },
      });
    }

    const res = await prisma.contactInfo.update({
      where: {
        id: data.id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        headline: data.headline,
        email: data.email!,
        phone: data.phone!,
        address: data.address,
      },
    });
    revalidatePath("/dashboard/profile/resume");
    return { data: res, success: true };
  } catch (error) {
    const msg = "Failed to update contact info.";
    return handleError(error, msg);
  }
};

export const createResumeProfile = async (
  title: string,
  fileName: string | null,
  fileContent?: Buffer
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Validate resume count limit
    const { validateResumeCreation, validateStorageUpload } = await import("@/lib/plan-validation");
    const resumeValidation = await validateResumeCreation();
    if (!resumeValidation.allowed) {
      throw new Error(resumeValidation.message);
    }

    // Validate storage if file is being uploaded
    if (fileContent) {
      const storageValidation = await validateStorageUpload(fileContent.length);
      if (!storageValidation.allowed) {
        throw new Error(storageValidation.message);
      }
    }

    const profile = await prisma.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    //check if title exists for this user's profile (case-insensitive)
    const trimmedTitle = title.trim();

    if (profile && profile.id) {
      // Fetch all resumes for this profile to do case-insensitive comparison
      const existingResumes = await prisma.resume.findMany({
        where: {
          profileId: profile.id,
        },
        select: {
          title: true,
        },
      });

      const titleExists = existingResumes.some(
        (resume) => resume.title.toLowerCase() === trimmedTitle.toLowerCase()
      );

      if (titleExists) {
        throw new ValidationError("Title already exists!", {
          context: { title, profileId: profile.id, userId: user.id },
        });
      }
    }

    const res =
      profile && profile.id
        ? await prisma.resume.create({
            data: {
              profileId: profile!.id,
              title: trimmedTitle,
              FileId: fileName && fileContent
                ? await createFileEntry(fileName, fileContent)
                : null,
            },
          })
        : await prisma.profile.create({
            data: {
              userId: user.id,
              resumes: {
                create: [
                  {
                    title: trimmedTitle,
                    FileId: fileName && fileContent
                      ? await createFileEntry(fileName, fileContent)
                      : null,
                  },
                ],
              },
            },
          });
    // revalidatePath("/dashboard/myjobs", "page");
    return { success: true, data: res };
  } catch (error) {
    const msg = "Failed to create resume.";
    return handleError(error, msg);
  }
};

const createFileEntry = async (
  fileName: string | undefined,
  fileContent: Buffer | undefined
): Promise<string> => {
  if (!fileName || !fileContent) {
    throw new Error("FileName and fileContent are required");
  }

  // Validate storage limit before uploading
  const { validateStorageUpload } = await import("@/lib/plan-validation");
  const storageValidation = await validateStorageUpload(fileContent.length);
  if (!storageValidation.allowed) {
    throw new Error(storageValidation.message);
  }
  
  const fileType = fileName.split(".").pop()?.toLowerCase() || "unknown";
  const newFileEntry = await prisma.file.create({
    data: {
      fileName: fileName,
      fileType: fileType,
      fileSize: fileContent.length,
      fileContent: fileContent,
    },
  });
  return newFileEntry.id;
};

export const editResume = async (
  id: string,
  title: string,
  fileId?: string,
  fileName?: string,
  fileContent?: Buffer
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "editResume" },
      });
    }

    // Get current resume to verify ownership and get profileId
    const currentResume = await prisma.resume.findUnique({
      where: { id },
      select: { 
        FileId: true,
        profileId: true,
        profile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!currentResume) {
      throw new ValidationError("Resume not found", {
        context: { resumeId: id },
      });
    }

    // Verify ownership
    if (currentResume.profile.userId !== user.id) {
      throw new AuthenticationError("Not authorized to edit this resume", {
        context: { resumeId: id, userId: user.id },
      });
    }

    // Check if title already exists for this user's profile (excluding current resume, case-insensitive)
    const trimmedTitle = title.trim();
    const existingResumes = await prisma.resume.findMany({
      where: {
        profileId: currentResume.profileId,
        NOT: {
          id,
        },
      },
      select: {
        title: true,
      },
    });

    const titleExists = existingResumes.some(
      (resume) => resume.title.toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (titleExists) {
      throw new ValidationError("Title already exists!", {
        context: { title, profileId: currentResume.profileId, userId: user.id },
      });
    }

    let resolvedFileId = fileId;

    // If uploading a new file, validate storage (accounting for old file being deleted)
    if (!fileId && fileName && fileContent) {
      // currentResume already fetched above, reuse FileId from it

      if (currentResume.FileId) {
        // Old file will be deleted, get its size
        const oldFile = await prisma.file.findUnique({
          where: { id: currentResume.FileId },
          select: { fileSize: true },
        });

        const oldFileSize = oldFile?.fileSize || 0;
        const newFileSize = fileContent.length;
        const netStorageChange = newFileSize - oldFileSize;

        // Only validate if net storage is increasing
        if (netStorageChange > 0) {
          const { validateStorageUpload } = await import("@/lib/plan-validation");
          const storageValidation = await validateStorageUpload(netStorageChange);
          if (!storageValidation.allowed) {
            throw new Error(storageValidation.message);
          }
        }
      } else {
        // No old file, validate normally
        const { validateStorageUpload } = await import("@/lib/plan-validation");
        const storageValidation = await validateStorageUpload(fileContent.length);
        if (!storageValidation.allowed) {
          throw new Error(storageValidation.message);
        }
      }

      resolvedFileId = await createFileEntry(fileName, fileContent);
    }

    if (resolvedFileId) {
      const isValidFileId = await prisma.file.findFirst({
        where: { id: resolvedFileId },
      });

      if (!isValidFileId) {
        throw new Error(
          `The provided FileId "${resolvedFileId}" does not exist.`
        );
      }
    }

    const res = await prisma.resume.update({
      where: { id },
      data: {
        title: trimmedTitle,
        FileId: resolvedFileId || null,
      },
    });
    return { success: true, data: res };
  } catch (error) {
    const msg = "Failed to update resume or file.";
    return handleError(error, msg);
  }
};

export const deleteResumeById = async (
  resumeId: string
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "deleteResumeById" },
      });
    }

    // Get the resume to find associated file
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        profile: {
          userId: user.id,
        },
      },
      select: {
        FileId: true,
      },
    });

    await prisma.$transaction(async (tx) => {
      // Delete associated file if it exists
      if (resume?.FileId) {
        await tx.file.deleteMany({
          where: {
            id: resume.FileId,
          },
        });
      }

      await tx.contactInfo.deleteMany({
        where: {
          resumeId: resumeId,
        },
      });

      // Find all sections for this resume to get their summaryIds
      const sections = await tx.resumeSection.findMany({
        where: {
          resumeId: resumeId,
        },
        select: {
          summaryId: true,
        },
      });

      // Delete summaries that are referenced by these sections
      const summaryIds = sections
        .map((s) => s.summaryId)
        .filter((id): id is string => id !== null);
      
      if (summaryIds.length > 0) {
        await tx.summary.deleteMany({
          where: {
            id: {
              in: summaryIds,
            },
          },
        });
      }

      // Delete work experiences, educations, and other related data
      await tx.workExperience.deleteMany({
        where: {
          ResumeSection: {
            is: {
              resumeId: resumeId,
            },
          },
        },
      });

      await tx.education.deleteMany({
        where: {
          ResumeSection: {
            is: {
              resumeId: resumeId,
            },
          },
        },
      });

      // Delete sections
      await tx.resumeSection.deleteMany({
        where: {
          resumeId: resumeId,
        },
      });

      // Finally delete the resume
      await tx.resume.delete({
        where: { id: resumeId },
      });
    });
    return { success: true };
  } catch (error) {
    const msg = "Failed to delete resume.";
    return handleError(error, msg);
  }
};

export const uploadFile = async (file: File): Promise<Buffer> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer;
};

export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      throw new Error("File not found in database");
    }

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
  } catch (error) {
    const msg = "Failed to delete file.";
    throw new Error(msg);
  }
};

export const addResumeSummary = async (
  data: z.infer<typeof AddSummarySectionFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "addResumeSummary" },
      });
    }

    // Verify resume ownership before proceeding
    const resume = await prisma.resume.findFirst({
      where: {
        id: data.resumeId!,
        profile: {
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!resume) {
      throw new AuthenticationError("Resume not found or access denied", {
        context: { function: "addResumeSummary", resumeId: data.resumeId, userId: user.id },
      });
    }

    // Use a transaction to ensure atomicity and prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Check if a summary section already exists for this resume
      const existingSummarySection = await tx.resumeSection.findFirst({
        where: {
          resumeId: data.resumeId!,
          sectionType: SectionType.SUMMARY,
        },
        include: {
          summary: true,
        },
      });

      if (existingSummarySection) {
        // Update existing summary section
        if (existingSummarySection.summary) {
          // Update existing summary content
          return await tx.resumeSection.update({
            where: {
              id: existingSummarySection.id,
            },
            data: {
              sectionTitle: data.sectionTitle!,
              summary: {
                update: {
                  content: data.content!,
                },
              },
            },
            include: {
              summary: true,
            },
          });
        } else {
          // Create summary for existing section (if summaryId is null, we can create)
          // But first check if summaryId is set but summary relation is missing
          if (existingSummarySection.summaryId) {
            // summaryId exists but summary relation is missing - this shouldn't happen
            // but if it does, try to update using the summaryId
            return await tx.resumeSection.update({
              where: {
                id: existingSummarySection.id,
              },
              data: {
                sectionTitle: data.sectionTitle!,
                summary: {
                  update: {
                    content: data.content!,
                  },
                },
              },
              include: {
                summary: true,
              },
            });
          } else {
            // No summaryId, safe to create new summary
            return await tx.resumeSection.update({
              where: {
                id: existingSummarySection.id,
              },
              data: {
                sectionTitle: data.sectionTitle!,
                summary: {
                  create: {
                    content: data.content!,
                  },
                },
              },
              include: {
                summary: true,
              },
            });
          }
        }
      } else {
        // Create new summary section with summary in one operation
        // First create the Summary
        const newSummary = await tx.summary.create({
          data: {
            content: data.content!,
          },
        });

        // Then create the ResumeSection with the summaryId already set
        return await tx.resumeSection.create({
          data: {
            resumeId: data.resumeId!,
            sectionTitle: data.sectionTitle!,
            sectionType: SectionType.SUMMARY,
            summaryId: newSummary.id,
          },
          include: {
            summary: true,
          },
        });
      }
    });

    /* Warning: a dynamic page path "/dashboard/profile/resume/[id]" was passed 
      to "revalidatePath", but the "type" parameter is missing. 
      This has no effect by default, 
      see more info here https://nextjs.org/docs/app/api-reference/functions/revalidatePath
      revalidatePath("/dashboard/profile/resume/[id]", "page");
    */
    revalidatePath("/dashboard/profile/resume/[id]", "page");
    return { data: result, success: true };
  } catch (error) {
    // Check if it's a Prisma unique constraint error
    if (
      error instanceof Error &&
      (error.message.includes("Unique constraint") ||
        error.message.includes("ResumeSection_summaryId_key"))
    ) {
      // This means a summary section already exists - try to update it instead
      try {
        const existingSection = await prisma.resumeSection.findFirst({
          where: {
            resumeId: data.resumeId!,
            sectionType: SectionType.SUMMARY,
          },
          include: {
            summary: true,
          },
        });

        if (existingSection) {
          const updated = await prisma.resumeSection.update({
            where: {
              id: existingSection.id,
            },
            data: {
              sectionTitle: data.sectionTitle!,
              summary: existingSection.summary
                ? {
                    update: {
                      content: data.content!,
                    },
                  }
                : {
                    create: {
                      content: data.content!,
                    },
                  },
            },
            include: {
              summary: true,
            },
          });
          revalidatePath("/dashboard/profile/resume/[id]", "page");
          return { data: updated, success: true };
        }
      } catch (retryError) {
        // If retry also fails, return the original error
        const msg = "A summary section already exists for this resume. Please edit the existing summary instead.";
        return handleError(error, msg, { resumeId: data.resumeId });
      }
    }
    const msg = "Failed to create summary.";
    return handleError(error, msg);
  }
};

export const updateResumeSummary = async (
  data: z.infer<typeof AddSummarySectionFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateResumeSummary" },
      });
    }

    // Check if summary exists for this section and verify ownership
    const existingSection = await prisma.resumeSection.findFirst({
      where: {
        id: data.id,
        Resume: {
          profile: {
            userId: user.id,
          },
        },
      },
      include: {
        summary: true,
      },
    });

    if (!existingSection) {
      throw new ValidationError("Resume section not found or access denied", {
        context: { function: "updateResumeSummary", sectionId: data.id, userId: user.id },
      });
    }

    // Update section title and summary (create if doesn't exist, update if it does)
    const summary = await prisma.resumeSection.update({
      where: {
        id: data.id,
      },
      data: {
        sectionTitle: data.sectionTitle!,
        summary: existingSection.summary
          ? {
              update: {
                content: data.content!,
              },
            }
          : {
              create: {
                content: data.content!,
              },
            },
      },
    });

    revalidatePath("/dashboard/profile/resume/[id]", "page");
    return { data: summary, success: true };
  } catch (error) {
    const msg = "Failed to update summary.";
    return handleError(error, msg);
  }
};

/**
 * Helper function to find or create a section with null summaryId for experience/education
 * Multiple sections can now have summaryId: null (unique constraint removed)
 */
async function findOrCreateNonSummarySection(
  resumeId: string,
  userId: string,
  sectionTitle: string
): Promise<any> {
  // Check if a section with null summaryId exists for this specific resume
  let section = await prisma.resumeSection.findFirst({
    where: {
      resumeId,
      summaryId: null,
      Resume: {
        profile: {
          userId,
        },
      },
    },
  });

  if (section) {
    return section;
  }

  // Check if there's a section with null summaryId in any of this user's other resumes
  section = await prisma.resumeSection.findFirst({
    where: {
      summaryId: null,
      Resume: {
        profile: {
          userId,
        },
      },
    },
  });

  if (section) {
    // Move it to this resume, preserving existing data
    return await prisma.resumeSection.update({
      where: { id: section.id },
      data: {
        resumeId,
        sectionTitle: sectionTitle || section.sectionTitle,
      },
    });
  }

  // Create a new section - no unique constraint to worry about anymore
  return await prisma.resumeSection.create({
    data: {
      resumeId,
      sectionTitle,
      sectionType: SectionType.EXPERIENCE,
    },
  });
}

export const addExperience = async (
  data: z.infer<typeof AddExperienceFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "addExperience" },
      });
    }

    // Validate required fields
    if (!data.resumeId) {
      throw new ValidationError("Resume ID is required", {
        context: { function: "addExperience" },
      });
    }

    if (!data.sectionId && !data.sectionTitle) {
      throw new ValidationError("Section title is required", {
        context: { function: "addExperience" },
      });
    }

    // Verify resume ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: data.resumeId,
        profile: {
          userId: user.id,
        },
      },
      select: { id: true },
    });

    if (!resume) {
      throw new AuthenticationError("Resume not found or access denied", {
        context: {
          function: "addExperience",
          resumeId: data.resumeId,
          userId: user.id,
        },
      });
    }

    // Get or create the section
    let section;
    if (data.sectionId) {
      // Verify section ownership
      section = await prisma.resumeSection.findFirst({
        where: {
          id: data.sectionId,
          resumeId: data.resumeId,
          Resume: {
            profile: {
              userId: user.id,
            },
          },
        },
      });

      if (!section) {
        throw new AuthenticationError("Resume section not found or access denied", {
          context: {
            function: "addExperience",
            sectionId: data.sectionId,
            userId: user.id,
          },
        });
      }
    } else {
      // Find or create a section with null summaryId for this user's resume
      section = await findOrCreateNonSummarySection(
        data.resumeId,
        user.id,
        data.sectionTitle || "Experience"
      );
    }

    // Add the work experience to the section
    const result = await prisma.resumeSection.update({
      where: { id: section.id },
      data: {
        workExperiences: {
          create: {
            jobTitleId: data.title,
            companyId: data.company,
            locationId: data.location,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.jobDescription,
          },
        },
      },
    });

    revalidatePath("/dashboard/profile/resume/[id]", "page");
    return { data: result, success: true };
  } catch (error) {
    const msg = "Failed to create experience.";
    return handleError(error, msg);
  }
};

export const updateExperience = async (
  data: z.infer<typeof AddExperienceFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateExperience" },
      });
    }

    // Verify experience ownership through ResumeSection -> Resume -> Profile -> userId
    const experience = await prisma.workExperience.findFirst({
      where: {
        id: data.id,
        ResumeSection: {
          Resume: {
            profile: {
              userId: user.id,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!experience) {
      throw new AuthenticationError("Experience not found or access denied", {
        context: { function: "updateExperience", experienceId: data.id, userId: user.id },
      });
    }

    const summary = await prisma.workExperience.update({
      where: {
        id: data.id,
      },
      data: {
        jobTitleId: data.title,
        companyId: data.company,
        locationId: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.jobDescription,
      },
    });
    revalidatePath("/dashboard/profile/resume/[id]", "page");
    return { data: summary, success: true };
  } catch (error) {
    const msg = "Failed to update experience.";
    return handleError(error, msg);
  }
};

export const addEducation = async (
  data: z.infer<typeof AddEducationFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "addEducation" },
      });
    }

    // Verify resume ownership before proceeding
    const resume = await prisma.resume.findFirst({
      where: {
        id: data.resumeId!,
        profile: {
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!resume) {
      throw new AuthenticationError("Resume not found or access denied", {
        context: { function: "addEducation", resumeId: data.resumeId, userId: user.id },
      });
    }

    let section;
    if (data.sectionId) {
      // Verify section ownership before using it
      const existingSection = await prisma.resumeSection.findFirst({
        where: {
          id: data.sectionId,
          resumeId: data.resumeId!,
          Resume: {
            profile: {
              userId: user.id,
            },
          },
        },
      });

      if (!existingSection) {
        throw new AuthenticationError("Resume section not found or access denied", {
          context: { function: "addEducation", sectionId: data.sectionId, userId: user.id },
        });
      }

      section = existingSection;
    } else {
      // Only search for sections within this user's resume - never search globally
      // First check for existing Education section
      let existingSection = await prisma.resumeSection.findFirst({
        where: {
          resumeId: data.resumeId!,
          sectionType: SectionType.EDUCATION,
          Resume: {
            profile: {
              userId: user.id,
            },
          },
        },
      });

      // If no Education section exists, check if there's a section with null summaryId for this resume
      // (due to unique constraint, only one null summaryId allowed globally)
      // Experience and Education can share the same section since they both have null summaryId
      if (!existingSection) {
        const sectionWithNullSummary = await prisma.resumeSection.findFirst({
          where: {
            resumeId: data.resumeId!,
            summaryId: null,
            Resume: {
              profile: {
                userId: user.id,
              },
            },
          },
        });

        if (sectionWithNullSummary) {
          // Found a section with null summaryId for this resume - reuse it as-is
          // Don't change sectionType - we want to preserve any existing Experience data
          // The section can hold both Experience and Education data
          existingSection = sectionWithNullSummary;
        } else {
          // Check if there's a section with null summaryId for ANY of this user's resumes
          // If found, we can move it to this resume
          const sectionWithNullSummaryAnyResume = await prisma.resumeSection.findFirst({
            where: {
              summaryId: null,
              Resume: {
                profile: {
                  userId: user.id,
                },
              },
            },
          });

          if (sectionWithNullSummaryAnyResume) {
            // Move it to this resume - don't change sectionType to preserve existing data
            existingSection = await prisma.resumeSection.update({
              where: { id: sectionWithNullSummaryAnyResume.id },
              data: {
                resumeId: data.resumeId!,
                sectionTitle: data.sectionTitle || sectionWithNullSummaryAnyResume.sectionTitle,
                // Don't change sectionType - preserve existing Experience/Education data
              },
            });
          }
        }
      }

      if (existingSection) {
        section = existingSection;
      } else {
        // Try to create a new section - if it fails due to unique constraint, we'll handle it
        try {
          section = await prisma.resumeSection.create({
            data: {
              resumeId: data.resumeId!,
              sectionTitle: data.sectionTitle!,
              sectionType: SectionType.EDUCATION,
            },
          });
        } catch (createError: any) {
          // If unique constraint error on summaryId, it means another section (possibly from another user) has null summaryId
          if (
            createError instanceof Error &&
            (createError.message.includes("Unique constraint") ||
              createError.message.includes("ResumeSection_summaryId_key"))
          ) {
            // Double-check if there's a section with null summaryId for ANY of this user's resumes
            // (check across all user's resumes, not just this one)
            const sectionWithNullSummary = await prisma.resumeSection.findFirst({
              where: {
                summaryId: null,
                Resume: {
                  profile: {
                    userId: user.id,
                  },
                },
              },
            });

            if (sectionWithNullSummary) {
              // Found a section with null summaryId from this user (could be from another resume)
              // Update it to belong to this resume - don't change sectionType to preserve existing data
              section = await prisma.resumeSection.update({
                where: { id: sectionWithNullSummary.id },
                data: {
                  resumeId: data.resumeId!,
                  sectionTitle: data.sectionTitle || sectionWithNullSummary.sectionTitle,
                  // Don't change sectionType - preserve existing Experience/Education data
                },
              });
            } else {
              // If we still don't have a section, this means:
              // 1. No section with null summaryId exists for this user
              // 2. Another user globally has the null summaryId section
              // This is a fundamental schema limitation
              throw new ValidationError(
                "Unable to create education section. The database allows only one section without a summary across all users. Please contact support or try deleting other experience/education sections first.",
                {
                  context: {
                    function: "addEducation",
                    resumeId: data.resumeId,
                    userId: user.id,
                  },
                }
              );
            }
          } else {
            throw createError;
          }
        }
      }
    }

    // TypeScript assertion: section is guaranteed to be defined at this point
    // (either found, created, or reused - or we would have thrown an error)
    if (!section) {
      throw new ValidationError("Failed to create or find resume section", {
        context: { function: "addEducation", resumeId: data.resumeId, userId: user.id },
      });
    }

    const education = await prisma.resumeSection.update({
      where: {
        id: section.id,
      },
      data: {
        educations: {
          create: {
            institution: data.institution,
            degree: data.degree,
            fieldOfStudy: data.fieldOfStudy,
            locationId: data.location,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
          },
        },
      },
    });
    revalidatePath("/dashboard/profile/resume/[id]", "page");
    return { data: education, success: true };
  } catch (error) {
    const msg = "Failed to create education.";
    return handleError(error, msg);
  }
};

export const updateEducation = async (
  data: z.infer<typeof AddEducationFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateEducation" },
      });
    }

    // Verify education ownership through ResumeSection -> Resume -> Profile -> userId
    const education = await prisma.education.findFirst({
      where: {
        id: data.id,
        ResumeSection: {
          Resume: {
            profile: {
              userId: user.id,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!education) {
      throw new AuthenticationError("Education not found or access denied", {
        context: { function: "updateEducation", educationId: data.id, userId: user.id },
      });
    }

    const summary = await prisma.education.update({
      where: {
        id: data.id,
      },
      data: {
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        locationId: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      },
    });
    revalidatePath("/dashboard/profile/resume/[id]", "page");
    return { data: summary, success: true };
  } catch (error) {
    const msg = "Failed to update education.";
    return handleError(error, msg);
  }
};
