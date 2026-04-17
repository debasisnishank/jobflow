import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type ActivityBreakdownDatum = {
  label: string;
  hours: number;
  percentage: number;
};

type ActivityBreakdownCardProps = {
  totalHours: number;
  breakdown: ActivityBreakdownDatum[];
};

export default function ActivityBreakdownCard({
  totalHours,
  breakdown,
}: ActivityBreakdownCardProps): JSX.Element {
  const hasData = breakdown.length > 0;
  const totalHoursLabel = `${totalHours.toFixed(1)} ${
    totalHours === 1 ? "hour" : "hours"
  }`;

  return (
    <Card className="h-full border border-border/70 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle>Weekly activity</CardTitle>
        <CardDescription>
          {hasData
            ? `${totalHoursLabel} logged across tracked activities.`
            : "Log activities to understand where your time goes."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasData ? (
          breakdown.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border/60 p-3"
            >
              <div className="flex items-center justify-between text-sm font-medium">
                <span>{item.label}</span>
                <span className="text-muted-foreground">
                  {item.hours.toFixed(1)}h • {item.percentage}%
                </span>
              </div>
              <Progress
                value={item.percentage}
                aria-label={`${item.label} ${item.hours.toFixed(1)} hours`}
                className="mt-2"
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No activity logs for the past week yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

