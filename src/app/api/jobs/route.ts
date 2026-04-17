import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/user.utils";
import { AuthenticationError } from "@/lib/errors";
import prisma from "@/lib/db";
import { unstable_cache } from "next/cache";
import { JobResponse } from "@/models/job.model";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function fetchJobsWithDuration(
  userId: string,
  page: number,
  limit: number,
  filter?: string,
  duration?: string,
  startDate?: string,
  endDate?: string
) {
  const skip = (page - 1) * limit;
  
  const filterBy: any = {};
  
  if (filter) {
    if (filter === "FT" || filter === "PT" || filter === "C") {
      filterBy.jobType = filter;
    } else {
      filterBy.Status = {
        value: filter,
      };
    }
  }
  
  if (duration === "custom") {
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      filterBy.createdAt = {
        gte: start,
        lte: end,
      };
    } else if (startDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      filterBy.createdAt = {
        gte: start,
      };
    } else if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      filterBy.createdAt = {
        lte: end,
      };
    }
  } else if (duration && duration !== "all" && duration !== "custom") {
    const days = parseInt(duration);
    if (!isNaN(days)) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filterBy.createdAt = {
        gte: cutoffDate,
      };
    }
  }

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where: {
        userId,
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
      },
    }),
    prisma.job.count({
      where: {
        userId,
        ...filterBy,
      },
    }),
  ]);

  return { success: true, data: data as JobResponse[], total };
}

const getCachedJobsList = (
  userId: string,
  page: number,
  limit: number,
  filter?: string,
  duration?: string,
  startDate?: string,
  endDate?: string
) => {
  const cacheKey = [
    "jobs-list",
    userId,
    page.toString(),
    limit.toString(),
    filter || "",
    duration || "",
    startDate || "",
    endDate || "",
  ];
  
  return unstable_cache(
    async () => {
      return await fetchJobsWithDuration(userId, page, limit, filter, duration, startDate, endDate);
    },
    cacheKey,
    {
      revalidate: 60,
      tags: ["jobs"],
    }
  )();
};

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "1000");
    const filter = searchParams.get("filter") || undefined;
    const duration = searchParams.get("duration") || "all";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const result = await getCachedJobsList(
      user.id,
      page,
      limit,
      filter,
      duration,
      startDate,
      endDate
    );
    
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
