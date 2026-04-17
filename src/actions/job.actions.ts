"use strict";
"use server";
import prisma from "@/lib/db";
import { handleError, ErrorResponse } from "@/lib/utils";
import { AddJobFormSchema } from "@/models/addJobForm.schema";
import {
  JOB_TYPES,
  JobStatus,
  JobSource,
  JobSourceWithCount,
  JobResponse,
  JobLocation,
} from "@/models/job.model";
import { JOB_STATUSES } from "@/lib/data/jobStatusesData";
import { getCurrentUser } from "@/utils/user.utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { AuthenticationError, ValidationError } from "@/lib/errors";

export interface SuccessResponse<T> {
  success: true;
  data?: T;
  total?: number;
  job?: T;
  res?: T;
}

export type ActionResponse<T> = SuccessResponse<T> | ErrorResponse;

export const getStatusList = async (): Promise<JobStatus[] | ErrorResponse> => {
  try {
    let statuses = await prisma.jobStatus.findMany({
      orderBy: {
        label: "asc",
      },
    });

    if (!statuses.length) {
      // Use upsert for each status to avoid duplicates
      await Promise.all(
        JOB_STATUSES.map(({ label, value }) =>
          prisma.jobStatus.upsert({
            where: {
              value: value,
            },
            update: {
              label: label,
            },
            create: {
              label: label,
              value: value,
            },
          })
        )
      );

      statuses = await prisma.jobStatus.findMany({
        orderBy: {
          label: "asc",
        },
      });
    }

    return statuses;
  } catch (error) {
    const msg = "Failed to fetch status list. ";
    return handleError(error, msg, { function: "getStatusList" });
  }
};

export const getJobSourceList = async (
  withCounts = false
): Promise<(JobSource | JobSourceWithCount)[] | ErrorResponse> => {
  try {
    const list = await prisma.jobSource.findMany({
      ...(withCounts
        ? {
            select: {
              id: true,
              label: true,
              value: true,
              _count: {
                select: {
                  jobsApplied: true,
                },
              },
            },
          }
        : {}),
      orderBy: {
        label: "asc",
      },
    });
    return list;
  } catch (error) {
    const msg = "Failed to fetch job source list. ";
    return handleError(error, msg);
  }
};

export const createJobSource = async (
  label: string
): Promise<ActionResponse<JobSource>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const value = label.trim().toLowerCase();

    if (!value) {
      throw new ValidationError("Please provide job source name", {
        context: { label, function: "createJobSource" },
      });
    }

    const source = await prisma.jobSource.upsert({
      where: {
        value,
      },
      update: {
        label: label.trim(),
      },
      create: {
        label: label.trim(),
        value,
      },
    });

    return { data: source, success: true };
  } catch (error) {
    const msg = "Failed to create job source. ";
    return handleError(error, msg);
  }
};

export const deleteJobSourceById = async (
  jobSourceId: string
): Promise<ActionResponse<JobSource>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "deleteJobSourceById" },
      });
    }

    // Use a transaction to ensure atomicity
    const res = await prisma.$transaction(async (tx) => {
      // First, set jobSourceId to null for all associated jobs
      await tx.job.updateMany({
        where: {
          jobSourceId,
        },
        data: {
          jobSourceId: null,
        },
      });

      // Then delete the job source
      return await tx.jobSource.delete({
        where: {
          id: jobSourceId,
        },
      });
    });

    return { res, success: true };
  } catch (error) {
    const msg = "Failed to delete job source. ";
    return handleError(error, msg);
  }
};

interface JobsListResponse {
  success: true;
  data: Array<{
    id: string;
    JobSource: JobSource | null;
    JobTitle: {
      id: string;
      label: string;
      value: string;
    };
    jobType: string;
    Company: {
      id: string;
      label: string;
      value: string;
    };
    Status: JobStatus;
    Location: JobLocation | null;
    dueDate: Date | null;
    appliedDate: Date | null;
    Resume: {
      id: string;
      title: string;
    } | null;
  }>;
  total: number;
}

export const getJobsList = async (
  page = 1,
  limit = 10,
  filter?: string
): Promise<JobsListResponse | ErrorResponse> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getJobsList" },
      });
    }
    const skip = (page - 1) * limit;

    const filterBy = filter
      ? filter === Object.keys(JOB_TYPES)[1]
        ? {
            jobType: filter,
          }
        : {
            Status: {
              value: filter,
            },
          }
      : {};
    const [data, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          userId: user.id,
          ...filterBy,
        },
        skip,
        take: limit,
        select: {
          id: true,
          JobSource: true,
          JobTitle: true,
          jobType: true,
          Company: true,
          Status: true,
          Location: true,
          dueDate: true,
          appliedDate: true,
          createdAt: true,
          description: false,
          Resume: true,
        },
        orderBy: {
          createdAt: "desc",
          // appliedDate: "desc",
        },
      }),
      prisma.job.count({
        where: {
          userId: user.id,
          ...filterBy,
        },
      }),
    ]);
    return { success: true, data, total };
  } catch (error) {
    const msg = "Failed to fetch jobs list. ";
    return handleError(error, msg);
  }
};

export async function* getJobsIterator(
  filter?: string,
  pageSize = 200
): AsyncGenerator<
  Array<{
    id: string;
    createdAt: Date;
    JobSource: JobSource | null;
    JobTitle: {
      id: string;
      label: string;
      value: string;
    };
    jobType: string;
    Company: {
      id: string;
      label: string;
      value: string;
    };
    Status: JobStatus;
    Location: JobLocation | null;
    dueDate: Date | null;
    applied: boolean;
    appliedDate: Date | null;
  }>,
  void,
  unknown
> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError("Not authenticated", {
      context: { function: "getJobsIterator" },
    });
  }
  let page = 1;
  let fetchedCount = 0;

  while (true) {
    const skip = (page - 1) * pageSize;
    const filterBy = filter
      ? filter === Object.keys(JOB_TYPES)[1]
        ? { status: filter }
        : { type: filter }
      : {};

    const chunk = await prisma.job.findMany({
      where: {
        userId: user.id,
        ...filterBy,
      },
      select: {
        id: true,
        createdAt: true,
        JobSource: true,
        JobTitle: true,
        jobType: true,
        Company: true,
        Status: true,
        Location: true,
        dueDate: true,
        applied: true,
        appliedDate: true,
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    if (!chunk.length) {
      break;
    }

    yield chunk;
    fetchedCount += chunk.length;
    page++;
  }
}

export const getJobDetails = async (
  jobId: string
): Promise<ActionResponse<JobResponse>> => {
  try {
    if (!jobId) {
      throw new ValidationError("Please provide job id", {
        context: { function: "getJobDetails" },
      });
    }
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getJobDetails" },
      });
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        JobSource: true,
        JobTitle: true,
        Company: true,
        Status: true,
        Location: true,
        Resume: {
          include: {
            File: true,
          },
        },
      },
    });
    if (!job) {
      throw new ValidationError("Job not found", {
        context: { jobId, function: "getJobDetails" },
      });
    }
    return { job: job as JobResponse, success: true };
  } catch (error) {
    const msg = "Failed to fetch job details. ";
    return handleError(error, msg);
  }
};

export const createLocation = async (
  label: string,
  stateProv?: string,
  country?: string
): Promise<ActionResponse<JobLocation>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "createLocation" },
      });
    }

    const value = label.trim().toLowerCase();

    if (!value) {
      throw new ValidationError("Please provide location name", {
        context: { label, function: "createLocation" },
      });
    }

    // Check if location with same value already exists for this user
    const existingLocation = await prisma.location.findFirst({
      where: {
        value,
        createdBy: user.id,
      },
    });

    if (existingLocation) {
      return { data: existingLocation, success: true };
    }

    const location = await prisma.location.create({
      data: {
        label,
        value,
        createdBy: user.id,
        stateProv: stateProv?.trim() || null,
        country: country?.trim() || null,
      },
    });

    return { data: location, success: true };
  } catch (error) {
    const msg = "Failed to create job location. ";
    return handleError(error, msg);
  }
};

export const addJob = async (
  data: z.infer<typeof AddJobFormSchema>
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "addJob" },
      });
    }

    const {
      title,
      company,
      location,
      type,
      status,
      source,
      salaryRange,
      salaryCurrency,
      dueDate,
      dateApplied,
      jobDescription,
      jobUrl,
      applied,
      resume,
    } = data;

    // Validate jobs applied limit if creating job with applied=true
    if (applied) {
      const { validateJobApplication } = await import("@/lib/plan-validation");
      const jobValidation = await validateJobApplication(false);
      if (!jobValidation.allowed) {
        return {
          success: false,
          message: jobValidation.message || "Job application limit reached",
        };
      }
    }

    const job = await prisma.job.create({
      data: {
        jobTitleId: title,
        companyId: company,
        locationId: location,
        statusId: status,
        jobSourceId: source,
        salaryRange: salaryRange,
        salaryCurrency: salaryCurrency,
        createdAt: new Date(),
        dueDate: dueDate,
        appliedDate: dateApplied,
        description: jobDescription,
        jobType: type,
        userId: user.id,
        jobUrl,
        applied,
        resumeId: resume,
      },
    });
    revalidateTag("jobs");
    return { job, success: true };
  } catch (error) {
    const msg = "Failed to create job. ";
    return handleError(error, msg);
  }
};

export const updateJob = async (
  data: z.infer<typeof AddJobFormSchema>
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateJob" },
      });
    }
    if (!data.id || user.id != data.userId) {
      throw new AuthenticationError("Id is not provided or no user privileges", {
        context: { userId: user.id, providedId: data.id, dataUserId: data.userId },
      });
    }

    const {
      id,
      title,
      company,
      location,
      type,
      status,
      source,
      salaryRange,
      salaryCurrency,
      dueDate,
      dateApplied,
      jobDescription,
      jobUrl,
      applied,
      resume,
    } = data;

    // Validate jobs applied limit if marking as applied
    if (applied) {
      // Check current job status
      const currentJob = await prisma.job.findUnique({
        where: { id },
        select: { applied: true },
      });

      const isCurrentlyApplied = currentJob?.applied || false;

      // Only validate if this is a new application (not already applied)
      if (!isCurrentlyApplied) {
        const { validateJobApplication } = await import("@/lib/plan-validation");
        const jobValidation = await validateJobApplication(isCurrentlyApplied);
        if (!jobValidation.allowed) {
          return {
            success: false,
            message: jobValidation.message || "Job application limit reached",
          };
        }
      }
    }

    const job = await prisma.job.update({
      where: {
        id,
      },
      data: {
        jobTitleId: title,
        companyId: company,
        locationId: location,
        statusId: status,
        jobSourceId: source,
        salaryRange: salaryRange,
        salaryCurrency: salaryCurrency,
        createdAt: new Date(),
        dueDate: dueDate,
        appliedDate: dateApplied,
        description: jobDescription,
        jobType: type,
        jobUrl,
        applied,
        resumeId: resume,
      },
    });
    revalidateTag("jobs");
    return { job, success: true };
  } catch (error) {
    const msg = "Failed to update job. ";
    return handleError(error, msg);
  }
};

export const updateJobStatus = async (
  jobId: string,
  status: JobStatus
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateJobStatus" },
      });
    }

    // Check current job status for validation
    const currentJob = await prisma.job.findUnique({
      where: { id: jobId, userId: user.id },
      select: { applied: true },
    });

    const isCurrentlyApplied = currentJob?.applied || false;
    const willMarkAsApplied = status.value === "applied" || status.value === "interview";

    // Validate jobs applied limit if marking as applied for the first time
    if (willMarkAsApplied && !isCurrentlyApplied) {
      const { validateJobApplication } = await import("@/lib/plan-validation");
      const jobValidation = await validateJobApplication(isCurrentlyApplied);
      if (!jobValidation.allowed) {
        return {
          success: false,
          message: jobValidation.message || "Job application limit reached",
        };
      }
    }

    const dataToUpdate = () => {
      switch (status.value) {
        case "applied":
          return {
            statusId: status.id,
            applied: true,
            appliedDate: new Date(),
          };
        case "interview":
          return {
            statusId: status.id,
            applied: true,
          };
        default:
          return {
            statusId: status.id,
          };
      }
    };

    const job = await prisma.job.update({
      where: {
        id: jobId,
        userId: user.id,
      },
      data: dataToUpdate(),
    });
    revalidateTag("jobs");
    return { job, success: true };
  } catch (error) {
    const msg = "Failed to update job status.";
    return handleError(error, msg);
  }
};

export const deleteJobById = async (
  jobId: string
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "deleteJobById" },
      });
    }

    const res = await prisma.job.delete({
      where: {
        id: jobId,
        userId: user.id,
      },
    });
    revalidateTag("jobs");
    return { res, success: true };
  } catch (error) {
    const msg = "Failed to delete job.";
    return handleError(error, msg);
  }
};
