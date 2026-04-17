"use strict";
"use server";
import prisma from "@/lib/db";
import { handleError } from "@/lib/utils";
import { getCurrentUser } from "@/utils/user.utils";
import { AuthenticationError, ValidationError } from "@/lib/errors";

export const getAllJobTitles = async (): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Not authenticated");
    }
    const list = await prisma.jobTitle.findMany({
      where: {
        createdBy: user?.id,
      },
    });
    return list;
  } catch (error) {
    const msg = "Failed to fetch job title list. ";
    return handleError(error, msg);
  }
};

export const getJobTitleList = async (
  page = 1,
  limit = 10,
  countBy?: string
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Not authenticated");
    }
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.jobTitle.findMany({
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
                _count: {
                  select: {
                    jobs: {
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
          jobs: {
            _count: "desc",
          },
        },
      }),
      prisma.jobTitle.count({
        where: {
          createdBy: user.id,
        },
      }),
    ]);
    return { data, total };
  } catch (error) {
    const msg = "Failed to fetch job title list. ";
    return handleError(error, msg);
  }
};

export const createJobTitle = async (
  label: string
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "createJobTitle" },
      });
    }

    const value = label.trim().toLowerCase();

    if (!value) {
      throw new ValidationError("Please provide job title name", {
        context: { label, function: "createJobTitle" },
      });
    }

    // Check if job title already exists for this user
    const existingTitle = await prisma.jobTitle.findFirst({
      where: {
        createdBy: user.id,
        value,
      },
    });

    if (existingTitle) {
      throw new ValidationError("Job title already exists!", {
        context: { label, value, userId: user.id },
      });
    }

    const createdTitle = await prisma.jobTitle.create({
      data: { label, value, createdBy: user.id },
    });

    return createdTitle;
  } catch (error) {
    const msg = "Failed to create job title. ";
    return handleError(error, msg);
  }
};

export const deleteJobTitleById = async (
  jobTitleId: string
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const experiences = await prisma.workExperience.count({
      where: {
        jobTitleId,
      },
    });
    if (experiences > 0) {
      throw new Error(
        `Job title cannot be deleted due to its use in experience section of one of the resume! `
      );
    }
    const jobs = await prisma.job.count({
      where: {
        jobTitleId,
      },
    });

    if (jobs > 0) {
      throw new Error(
        `Job title cannot be deleted due to ${jobs} number of associated jobs! `
      );
    }

    const res = await prisma.jobTitle.delete({
      where: {
        id: jobTitleId,
        createdBy: user.id,
      },
    });
    return { res, success: true };
  } catch (error) {
    const msg = "Failed to delete job title.";
    return handleError(error, msg);
  }
};
