"use strict";

import prisma from "@/lib/db";
import { calculatePercentageDifference, getLast7Days } from "@/lib/utils";
import { getCurrentUser } from "@/utils/user.utils";
import { Prisma } from "@prisma/client";
import { format, subDays } from "date-fns";
import { DatabaseError, AuthenticationError } from "@/lib/errors";

interface JobsAppliedResponse {
  count: number;
  trend: number | null;
}

export const getJobsAppliedForPeriod = async (
  daysAgo: number,
  userId?: string
): Promise<JobsAppliedResponse> => {
  const user = userId ? { id: userId } : await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Not authenticated", {
      context: { function: "getJobsAppliedForPeriod" },
    });
  }

  try {
    const startDate1 = subDays(new Date(), daysAgo);
    const startDate2 = subDays(new Date(), daysAgo * 2);
    const endDate = new Date();
    const query = (date: Date): Prisma.JobCountArgs => ({
      where: {
        userId: user.id,
        applied: true,
        appliedDate: {
          gte: date,
          lt: endDate,
        },
      },
    });

    const [count, count2] = await prisma.$transaction([
      prisma.job.count(query(startDate1)),
      prisma.job.count(query(startDate2)),
    ]);
    const trend = calculatePercentageDifference(count2, count);
    return { count, trend };
  } catch (error) {
    const msg = "Failed to calculate job count";
    throw new DatabaseError(msg, {
      context: { daysAgo, userId: user.id },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

interface RecentJob {
  id: string;
  JobSource: { id: string; label: string; value: string } | null;
  JobTitle: { id: string; label: string; value: string; createdBy: string };
  jobType: string;
  Company: { id: string; label: string; value: string };
  Status: { id: string; label: string; value: string };
  Location: { id: string; label: string; value: string; stateProv: string | null; country: string | null; createdBy: string } | null;
  appliedDate: Date | null;
}

export const getRecentJobs = async (userId?: string): Promise<RecentJob[]> => {
  let user;
  try {
    user = userId ? { id: userId } : await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getRecentJobs" },
      });
    }
    const list = await prisma.job.findMany({
      where: {
        userId: user.id,
        applied: true,
      },
      include: {
        JobSource: true,
        JobTitle: true,
        Company: true,
        Status: true,
        Location: true,
      },
      orderBy: {
        appliedDate: "desc",
      },
      take: 6,
    });
    return list;
  } catch (error) {
    const msg = "Failed to fetch jobs list. ";
    throw new DatabaseError(msg, {
      context: { userId: user?.id },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

interface ActivityDataPoint {
  day: string;
  [activityType: string]: string | number;
}

export const getActivityDataForPeriod = async (userId?: string): Promise<ActivityDataPoint[]> => {
  let user;
  try {
    user = userId ? { id: userId } : await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getActivityDataForPeriod" },
      });
    }
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);
    const activities = await prisma.activity.findMany({
      where: {
        userId: user.id,
        endTime: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      select: {
        endTime: true,
        duration: true,
        activityType: {
          select: {
            label: true,
          },
        },
      },
      orderBy: {
        endTime: "asc",
      },
    });
    const groupedData = activities.reduce(
      (acc: Record<string, ActivityDataPoint>, activity) => {
        const day = format(new Date(activity.endTime || new Date()), "PP");
        const activityTypeLabel = activity.activityType?.label || "Unknown";

        if (!acc[day]) {
          acc[day] = { day: day.split(",")[0] };
        }

        const durationInHours = (activity.duration || 0) / 60;
        const currentValueStr = String(acc[day][activityTypeLabel] || "0");
        const currentValue = parseFloat(currentValueStr) || 0;
        acc[day][activityTypeLabel] = (
          currentValue + durationInHours
        ).toFixed(1);

        return acc;
      }, {});
    const last7Days = getLast7Days();
    const result = last7Days.map((date) => {
      const dayKey = date.split(",")[0];
      const existingData = groupedData[date];
      if (existingData) {
        return {
          ...existingData,
          day: dayKey,
        };
      }
      return { day: dayKey };
    });

    return result;
  } catch (error) {
    const msg = "Failed to fetch activities data.";
    throw new DatabaseError(msg, {
      context: { userId: user?.id },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

interface JobActivityDataPoint {
  day: string;
  value: number;
}

export const getJobsActivityForPeriod = async (userId?: string): Promise<JobActivityDataPoint[]> => {
  let user;
  try {
    user = userId ? { id: userId } : await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getJobsActivityForPeriod" },
      });
    }
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);
    const jobData = await prisma.job.groupBy({
      by: "appliedDate",
      _count: {
        _all: true,
      },
      where: {
        userId: user.id,
        applied: true,
        appliedDate: {
          gte: startDate,
          lte: today,
        },
      },
      orderBy: {
        appliedDate: "asc",
      },
    });
    // Reduce to a format that groups by unique date (YYYY-MM-DD)
    const groupedPosts = jobData.reduce(
      (acc: Record<string, number>, post) => {
        const date = format(new Date(post.appliedDate || new Date()), "PP");
        acc[date] = (acc[date] || 0) + post._count._all;
        return acc;
      }, {});
    // Get the last 7 days
    const last7Days = getLast7Days();
    // Map to ensure all dates are represented with a count of 0 if necessary
    const result = last7Days.map((date) => ({
      day: date.split(",")[0],
      value: groupedPosts[date] || 0,
    }));

    return result;
  } catch (error) {
    const msg = "Failed to fetch jobs list. ";
    throw new DatabaseError(msg, {
      context: { userId: user?.id },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

interface CalendarYearData {
  [year: string]: Array<{ day: string; value: number }>;
}

interface CompanyStats {
  totalCompanies: number;
  topCompanies: Array<{
    id: string;
    label: string;
    logoUrl: string | null;
    applicationsCount: number;
  }>;
  companiesWithApplications: number;
}

export const getCompanyStats = async (userId?: string): Promise<CompanyStats> => {
  let user;
  try {
    user = userId ? { id: userId } : await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getCompanyStats" },
      });
    }
    const [totalCompanies, topCompanies, companiesWithApplications] =
      await Promise.all([
        prisma.company.count({
          where: {
            createdBy: user.id,
          },
        }),
        prisma.company.findMany({
          where: {
            createdBy: user.id,
          },
          select: {
            id: true,
            label: true,
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
          orderBy: {
            jobsApplied: {
              _count: "desc",
            },
          },
          take: 5,
        }),
        prisma.company.count({
          where: {
            createdBy: user.id,
            jobsApplied: {
              some: {
                applied: true,
              },
            },
          },
        }),
      ]);

    return {
      totalCompanies,
      topCompanies: topCompanies.map((company) => ({
        id: company.id,
        label: company.label,
        logoUrl: company.logoUrl,
        applicationsCount: company._count.jobsApplied,
      })),
      companiesWithApplications,
    };
  } catch (error) {
    const msg = "Failed to fetch company statistics.";
    throw new DatabaseError(msg, {
      context: { userId: user?.id },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

export const getActivityCalendarData = async (userId?: string): Promise<CalendarYearData> => {
  let user;
  try {
    user = userId ? { id: userId } : await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "getActivityCalendarData" },
      });
    }
    const today = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(today.getDate() - 356);
    const jobData = await prisma.job.groupBy({
      by: "appliedDate",
      _count: {
        _all: true,
      },
      where: {
        userId: user.id,
        applied: true,
        appliedDate: {
          gte: daysAgo, // A year of data
          lte: today,
        },
      },
      orderBy: {
        appliedDate: "asc",
      },
    });


    // Reduce to a format that groups by unique date (YYYY-MM-DD)
    const groupedJobs = jobData.reduce(
      (acc: Record<string, number>, job) => {
        const date = format(new Date(job.appliedDate || new Date()), "yyyy-MM-dd");
        acc[date] = (acc[date] || 0) + job._count._all;
        return acc;
      }, {});

    const groupedByYear = Object.entries(groupedJobs).reduce(
      (acc: CalendarYearData, [date, value]) => {
        const year = date.split("-")[0];
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push({ day: date, value });
        return acc;
      },
      {}
    );

    return groupedByYear;
  } catch (error) {
    const msg = "Failed to fetch jobs list. ";
    throw new DatabaseError(msg, {
      context: { userId: user?.id },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
};
