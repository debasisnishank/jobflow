import {
  getActivityCalendarData,
  getActivityDataForPeriod,
  getCompanyStats,
  getJobsActivityForPeriod,
  getJobsAppliedForPeriod,
  getRecentJobs,
} from "@/actions/dashboard.actions";
import { getCurrentUser } from "@/utils/user.utils";
import ActivityCalendar from "@/components/dashboard/ActivityCalendar";
import ActivityBreakdownCard, {
  ActivityBreakdownDatum,
} from "@/components/dashboard/ActivityBreakdownCard";
import CompanyStatusCard from "@/components/dashboard/CompanyStatusCard";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardHighlights, {
  DashboardHighlight,
} from "@/components/dashboard/DashboardHighlights";
import GoalProgressCard from "@/components/dashboard/GoalProgressCard";
import NumberCard from "@/components/dashboard/NumberCard";
import RecentJobsCard from "@/components/dashboard/RecentJobsCard";
import WeeklyBarChart from "@/components/dashboard/WeeklyBarChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

type WeeklyJobDatum = {
  day: string;
  value: number;
};

type ActivityDatum = {
  day: string;
} & Record<string, string | undefined>;

type ActivityCalendarData = Record<string, { day: string; value: number }[]>;

type JobHighlightSummary = {
  totalApplied: number;
  averagePerDay: number;
  bestDayLabel: string;
  bestDayValue: number;
  activeStreak: number;
};

type ActivityBreakdownResult = {
  totalHours: number;
  breakdown: ActivityBreakdownDatum[];
};

import { APP_CONSTANTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard(): Promise<JSX.Element> {
  // Get user once and pass userId to all functions to avoid multiple DB queries
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const [
    { count: jobsAppliedLast7Days, trend: trendFor7Days },
    { count: jobsAppliedLast30Days, trend: trendFor30Days },
    recentJobsRaw,
    weeklyDataRaw,
    activitiesDataRaw,
    activityCalendarDataRaw,
    companyStatsRaw,
  ] = await Promise.all([
    getJobsAppliedForPeriod(7, user.id),
    getJobsAppliedForPeriod(30, user.id),
    getRecentJobs(user.id),
    getJobsActivityForPeriod(user.id),
    getActivityDataForPeriod(user.id),
    getActivityCalendarData(user.id),
    getCompanyStats(user.id),
  ]);

  const recentJobs = recentJobsRaw ?? [];
  const weeklyData = (weeklyDataRaw ?? []) as WeeklyJobDatum[];
  const activitiesData = (activitiesDataRaw ?? []) as ActivityDatum[];
  const activityCalendarData = (activityCalendarDataRaw ??
    {}) as ActivityCalendarData;
  const calendarYears = Object.keys(activityCalendarData);
  const calendarDefaultYear = calendarYears.at(-1);
  const companyStats = companyStatsRaw ?? {
    totalCompanies: 0,
    topCompanies: [],
    companiesWithApplications: 0,
  };

  const jobHighlights = calculateJobHighlightSummary(weeklyData);
  const highlightCards = createHighlightCards(jobHighlights);
  const activityBreakdown = buildActivityBreakdown(activitiesData);
  const activityKeys = getActivityKeys(activitiesData);

  const hasActivityKeys = activityKeys.length > 0;
  const resolvedActivitiesData = hasActivityKeys
    ? activitiesData
    : weeklyData.map((entry) => ({
      day: entry.day,
      "No activity": "0",
    })) as ActivityDatum[];
  const resolvedActivityKeys = hasActivityKeys ? activityKeys : ["No activity"];

  return (
    <>
      <section className="col-span-3 space-y-4">
        <DashboardHero
          weeklyTotal={jobHighlights.totalApplied}
          weeklyGoal={APP_CONSTANTS.WEEKLY_JOB_GOAL}
          trend={trendFor7Days}
        />
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-[3fr_1fr]">
          <DashboardHighlights highlights={highlightCards} />
          <GoalProgressCard
            weeklyTotal={jobHighlights.totalApplied}
            weeklyGoal={APP_CONSTANTS.WEEKLY_JOB_GOAL}
            trend={trendFor7Days}
          />
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
              <NumberCard
                label="Last 7 days"
                num={jobsAppliedLast7Days}
                trend={trendFor7Days}
              />
              <NumberCard
                label="Last 30 days"
                num={jobsAppliedLast30Days}
                trend={trendFor30Days}
              />
            </div>
            <Tabs defaultValue="jobs">
              <TabsList>
                <TabsTrigger value="jobs">Weekly Jobs</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              <TabsContent value="jobs">
                <WeeklyBarChart
                  data={weeklyData}
                  keys={["value"]}
                  axisLeftLegend="NUMBER OF JOBS APPLIED"
                />
              </TabsContent>
              <TabsContent value="activities">
                <WeeklyBarChart
                  data={resolvedActivitiesData}
                  keys={resolvedActivityKeys}
                  groupMode="stacked"
                  axisLeftLegend="TIME SPENT (Hours)"
                />
              </TabsContent>
            </Tabs>
          </div>
          <CompanyStatusCard companyStats={companyStats} />
        </div>
      </section>
      <section className="col-span-3 grid gap-4 grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <RecentJobsCard jobs={recentJobs} />
        <div className="space-y-4">
          <ActivityBreakdownCard
            totalHours={activityBreakdown.totalHours}
            breakdown={activityBreakdown.breakdown}
          />
          {calendarYears.length > 0 && calendarDefaultYear ? (
            <div className="w-full space-y-2">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Yearly momentum
              </p>
              <Tabs defaultValue={calendarDefaultYear}>
                <TabsList className="flex flex-wrap">
                  {calendarYears.map((year) => (
                    <TabsTrigger key={year} value={year}>
                      {year}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {calendarYears.map((year) => (
                  <TabsContent key={year} value={year}>
                    <ActivityCalendar
                      year={year}
                      data={activityCalendarData[year]}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-background/30 p-6 text-sm text-muted-foreground">
              Track new job applications to unlock your yearly activity map.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function calculateJobHighlightSummary(
  weeklyData: WeeklyJobDatum[]
): JobHighlightSummary {
  if (weeklyData.length === 0) {
    return {
      totalApplied: 0,
      averagePerDay: 0,
      bestDayLabel: "No activity yet",
      bestDayValue: 0,
      activeStreak: 0,
    };
  }

  const totalApplied = weeklyData.reduce(
    (accumulator, entry) => accumulator + entry.value,
    0
  );
  const bestDayEntry = weeklyData.reduce((previous, entry) =>
    entry.value > previous.value ? entry : previous
  );

  return {
    totalApplied,
    averagePerDay: totalApplied / weeklyData.length,
    bestDayLabel: bestDayEntry.value > 0 ? bestDayEntry.day : "No activity yet",
    bestDayValue: bestDayEntry.value,
    activeStreak: getActiveStreak(weeklyData),
  };
}

function getActiveStreak(weeklyData: WeeklyJobDatum[]): number {
  let streak = 0;
  for (let index = weeklyData.length - 1; index >= 0; index -= 1) {
    if (weeklyData[index]?.value > 0) {
      streak += 1;
    } else if (streak > 0) {
      break;
    }
  }
  return streak;
}

function createHighlightCards(
  summary: JobHighlightSummary
): DashboardHighlight[] {
  return [
    {
      id: "weekly-total",
      title: "Weekly total",
      value: summary.totalApplied.toString(),
      helper:
        summary.totalApplied > 0
          ? `${summary.averagePerDay.toFixed(1)} avg per day`
          : "Apply to your first role this week.",
    },
    {
      id: "best-day",
      title: "Best day",
      value: summary.bestDayValue > 0 ? summary.bestDayLabel : "No activity",
      helper:
        summary.bestDayValue > 0
          ? `${summary.bestDayValue} job${summary.bestDayValue === 1 ? "" : "s"
          } submitted`
          : "Log activity to unlock this insight.",
    },
    {
      id: "active-streak",
      title: "Active streak",
      value: summary.activeStreak > 0 ? `${summary.activeStreak} days` : "0 days",
      helper:
        summary.activeStreak > 0
          ? "Keep the streak alive tomorrow."
          : "Daily streak not started.",
    },
  ];
}

function getActivityKeys(data: ActivityDatum[]): string[] {
  return Array.from(
    new Set(
      data.flatMap((entry) =>
        Object.keys(entry).filter((key) => key !== "day")
      )
    )
  );
}

function buildActivityBreakdown(
  activitiesData: ActivityDatum[]
): ActivityBreakdownResult {
  const totals: Record<string, number> = {};

  activitiesData.forEach((entry) => {
    Object.entries(entry).forEach(([key, value]) => {
      if (key === "day" || value === undefined) {
        return;
      }
      const parsedValue = Number(value);
      if (!Number.isFinite(parsedValue)) {
        return;
      }
      totals[key] = (totals[key] || 0) + parsedValue;
    });
  });

  const totalHours = Object.values(totals).reduce(
    (accumulator, value) => accumulator + value,
    0
  );

  const breakdown: ActivityBreakdownDatum[] = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([label, hours]) => ({
      label,
      hours: parseFloat(hours.toFixed(1)),
      percentage: totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0,
    }));

  return {
    totalHours: parseFloat(totalHours.toFixed(1)),
    breakdown,
  };
}
