"use strict";
"use server";
import prisma from "@/lib/db";
import { handleError } from "@/lib/utils";
import { AddCompanyFormSchema } from "@/models/addCompanyForm.schema";
import { getCurrentUser } from "@/utils/user.utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AuthenticationError, ValidationError, DatabaseError } from "@/lib/errors";

export const createCompanyLogoFile = async (
  fileName: string | undefined,
  fileContent: Buffer | undefined
): Promise<string> => {
  if (!fileName || !fileContent) {
    throw new ValidationError("FileName and fileContent are required", {
      context: { function: "createCompanyLogoFile" },
    });
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

export const getCompanyList = async (
  page = 1,
  limit = 10,
  countBy?: string
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getCompanyList" },
      });
    }
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.company.findMany({
        where: {
          createdBy: user.id,
        },
        skip,
        take: limit,
        ...(countBy
          ? {
              select: {
                id: true,
                label: true,
                value: true,
                logoUrl: true,
                _count: {
                  select: {
                    jobsApplied: {
                      where: {
                        applied: true,
                      },
                    },
                  },
                },
              },
            }
          : {}),
        orderBy: {
          jobsApplied: {
            _count: "desc",
          },
        },
      }),
      prisma.company.count({
        where: {
          createdBy: user.id,
        },
      }),
    ]);
    return { data, total };
  } catch (error) {
    const msg = "Failed to fetch company list. ";
    return handleError(error, msg);
  }
};

export const getAllCompanies = async (): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getCompanyList" },
      });
    }

    const comapnies = await prisma.company.findMany({
      where: {
        createdBy: user.id,
      },
    });
    return comapnies;
  } catch (error) {
    const msg = "Failed to fetch all companies. ";
    return handleError(error, msg);
  }
};

export const addCompany = async (
  data: z.infer<typeof AddCompanyFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getCompanyList" },
      });
    }

    const { company, logoUrl, fileId } = data;

    const value = company.trim().toLowerCase();

    const companyExists = await prisma.company.findFirst({
      where: {
        createdBy: user.id,
        value,
      },
    });

    if (companyExists) {
      throw new ValidationError("Company already exists!", {
        context: { company, value, userId: user.id },
      });
    }

    // If fileId exists, construct the API URL for the logo
    const finalLogoUrl = fileId
      ? `/api/company/logo?fileId=${fileId}`
      : logoUrl || null;

    const res = await prisma.company.create({
      data: {
        createdBy: user.id,
        value,
        label: company,
        logoUrl: finalLogoUrl,
      },
    });
    revalidatePath("/dashboard/myjobs", "page");
    return { success: true, data: res };
  } catch (error) {
    const msg = "Failed to create company.";
    return handleError(error, msg);
  }
};

export const updateCompany = async (
  data: z.infer<typeof AddCompanyFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getCompanyList" },
      });
    }

    const { id, company, logoUrl, fileId, createdBy } = data;

    if (!id || user.id != createdBy) {
      throw new AuthenticationError("Id is not provided or no user privileges", {
        context: { userId: user.id, providedId: id, createdBy },
      });
    }

    const value = company.trim().toLowerCase();

    const companyExists = await prisma.company.findFirst({
      where: {
        createdBy: user.id,
        value,
        NOT: {
          id,
        },
      },
    });

    if (companyExists) {
      throw new ValidationError("Company already exists!", {
        context: { company, value, userId: user.id },
      });
    }

    // If fileId exists, construct the API URL for the logo
    // If fileId is provided, it means a new file was uploaded
    const finalLogoUrl = fileId
      ? `/api/company/logo?fileId=${fileId}`
      : logoUrl || null;

    const res = await prisma.company.update({
      where: {
        id,
      },
      data: {
        value,
        label: company,
        logoUrl: finalLogoUrl,
      },
    });

    return { success: true, data: res };
  } catch (error) {
    const msg = "Failed to update company.";
    return handleError(error, msg);
  }
};

export const getCompanyById = async (
  companyId: string
): Promise<any | undefined> => {
  try {
    if (!companyId) {
      throw new ValidationError("Please provide company id", {
        context: { function: "getCompanyById" },
      });
    }
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getCompanyList" },
      });
    }

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
    return company;
  } catch (error) {
    const msg = "Failed to fetch company by Id. ";
    return handleError(error, msg, { companyId });
  }
};

export const deleteCompanyById = async (
  companyId: string
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getCompanyList" },
      });
    }

    const experiences = await prisma.workExperience.count({
      where: {
        companyId,
      },
    });
    if (experiences > 0) {
      throw new ValidationError(
        "Company cannot be deleted due to its use in experience section of one of the resume!",
        {
          context: { companyId, experiencesCount: experiences },
        }
      );
    }
    const jobs = await prisma.job.count({
      where: {
        companyId,
      },
    });

    if (jobs > 0) {
      throw new ValidationError(
        `Company cannot be deleted due to ${jobs} number of associated jobs!`,
        {
          context: { companyId, jobsCount: jobs },
        }
      );
    }

    const res = await prisma.company.delete({
      where: {
        id: companyId,
        createdBy: user.id,
      },
    });
    return { res, success: true };
  } catch (error) {
    const msg = "Failed to delete company.";
    return handleError(error, msg);
  }
};
