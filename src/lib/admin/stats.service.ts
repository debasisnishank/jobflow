import "server-only";
import prisma from "@/lib/db";

export interface AdminStats {
  totalUsers: number;
  totalResumes: number;
  totalJobs: number;
  activeSubscriptions: {
    free: number;
    freshers: number;
    experience: number;
  };
  recentUsers: number;
  recentResumes: number;
  recentJobs: number;
  userGrowthData: { day: string; value: number }[];
  resumeGrowthData: { day: string; value: number }[];
  jobGrowthData: { day: string; value: number }[];
  subscriptionDistribution: { plan: string; count: number }[];
}

function getDaysForDuration(days: number) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    if (days <= 7) {
      result.push({
        day: dayNames[date.getDay()],
        date: date.toISOString().split("T")[0],
      });
    } else if (days <= 30) {
      result.push({
        day: `${date.getDate()} ${monthNames[date.getMonth()]}`,
        date: date.toISOString().split("T")[0],
      });
    } else {
      result.push({
        day: `${date.getDate()}/${date.getMonth() + 1}`,
        date: date.toISOString().split("T")[0],
      });
    }
  }
  return result;
}

async function getAllTimeData(
  model: typeof prisma.user | typeof prisma.resume | typeof prisma.job
) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const records = await (model as any).findMany({
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (records.length === 0) {
    return [];
  }

  const monthlyData: Record<string, number> = {};
  
  records.forEach((record: { createdAt: Date }) => {
    const date = new Date(record.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  });

  const sortedMonths = Object.keys(monthlyData).sort();
  
  return sortedMonths.map((monthKey) => {
    const [year, month] = monthKey.split("-");
    return {
      day: `${monthNames[parseInt(month) - 1]} ${year}`,
      value: monthlyData[monthKey],
    };
  });
}

export async function getAdminStats(duration: number | "all" = 7): Promise<AdminStats> {
  const isAllTime = duration === "all";
  const days = isAllTime ? [] : getDaysForDuration(duration as number);
  const startDate = isAllTime ? null : new Date(days[0].date);
  if (startDate) {
    startDate.setHours(0, 0, 0, 0);
  }

  const [
    totalUsers,
    totalResumes,
    totalJobs,
    usersByPlan,
    recentUsers,
    recentResumes,
    recentJobs,
    usersData,
    resumesData,
    jobsData,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.job.count(),
    prisma.user.groupBy({
      by: ["subscriptionPlan"],
      _count: {
        subscriptionPlan: true,
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.resume.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.job.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    isAllTime
      ? getAllTimeData(prisma.user)
      : Promise.all(
          days.map(async (day) => {
            const dayStart = new Date(day.date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day.date);
            dayEnd.setHours(23, 59, 59, 999);

            const count = await prisma.user.count({
              where: {
                createdAt: {
                  gte: dayStart,
                  lte: dayEnd,
                },
              },
            });

            return { day: day.day, value: count };
          })
        ),
    isAllTime
      ? getAllTimeData(prisma.resume)
      : Promise.all(
          days.map(async (day) => {
            const dayStart = new Date(day.date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day.date);
            dayEnd.setHours(23, 59, 59, 999);

            const count = await prisma.resume.count({
              where: {
                createdAt: {
                  gte: dayStart,
                  lte: dayEnd,
                },
              },
            });

            return { day: day.day, value: count };
          })
        ),
    isAllTime
      ? getAllTimeData(prisma.job)
      : Promise.all(
          days.map(async (day) => {
            const dayStart = new Date(day.date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day.date);
            dayEnd.setHours(23, 59, 59, 999);

            const count = await prisma.job.count({
              where: {
                createdAt: {
                  gte: dayStart,
                  lte: dayEnd,
                },
              },
            });

            return { day: day.day, value: count };
          })
        ),
  ]);

  const activeSubscriptions = {
    free: usersByPlan.find((p) => p.subscriptionPlan === "free")?._count.subscriptionPlan || 0,
    freshers: usersByPlan.find((p) => p.subscriptionPlan === "freshers")?._count.subscriptionPlan || 0,
    experience: usersByPlan.find((p) => p.subscriptionPlan === "experience")?._count.subscriptionPlan || 0,
  };

  const subscriptionDistribution = [
    { plan: "Free", count: activeSubscriptions.free },
    { plan: "Freshers", count: activeSubscriptions.freshers },
    { plan: "Experience", count: activeSubscriptions.experience },
  ];

  return {
    totalUsers,
    totalResumes,
    totalJobs,
    activeSubscriptions,
    recentUsers,
    recentResumes,
    recentJobs,
    userGrowthData: usersData,
    resumeGrowthData: resumesData,
    jobGrowthData: jobsData,
    subscriptionDistribution,
  };
}
