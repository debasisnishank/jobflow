import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type GoalProgressCardProps = {
  weeklyTotal: number;
  weeklyGoal: number;
  trend: number | null;
};

export default function GoalProgressCard({
  weeklyTotal,
  weeklyGoal,
  trend,
}: GoalProgressCardProps): JSX.Element {
  const progress = Math.min(
    Math.round((weeklyTotal / weeklyGoal) * 100),
    100
  );
  const remaining = Math.max(weeklyGoal - weeklyTotal, 0);
  const helper =
    weeklyTotal >= weeklyGoal
      ? "Goal met this week—fantastic momentum."
      : `${remaining} application${remaining === 1 ? "" : "s"} to hit your target.`;

  return (
    <Card className="h-full border border-border/70 bg-gradient-to-br from-[#1D4ED8] via-[#3B82F6] to-[#1D4ED8] text-white shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-white">Weekly goal</CardTitle>
        <CardDescription className="text-white/70">
          Tracking {weeklyGoal} job application
          {weeklyGoal === 1 ? "" : "s"} per week.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-4xl font-semibold">{weeklyTotal}</p>
            <p className="text-sm text-white/70">submitted this week</p>
          </div>
          <span className="text-sm text-white/60">{progress}%</span>
        </div>
        <Progress
          value={progress}
          aria-label="Weekly goal progress"
          className="h-2 bg-white/10"
        />
        <p className="text-sm text-white/80">{helper}</p>
        <p className="text-xs uppercase text-white/60">
          7-day trend: {trend !== null ? `${trend >= 0 ? "+" : ""}${trend}%` : "N/A"}
        </p>
      </CardContent>
    </Card>
  );
}

