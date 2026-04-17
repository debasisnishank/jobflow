import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp } from "lucide-react";

interface NumberCardProps {
  label: string;
  num: number;
  trend: number | null;
}

export default function NumberCard({
  label,
  num,
  trend,
}: NumberCardProps): JSX.Element {
  const trendValue = trend ?? 0;
  const isPositive = trendValue >= 0;
  const trendIcon = isPositive ? (
    <TrendingUp className="h-4 w-4 text-emerald-500" />
  ) : (
    <TrendingDown className="h-4 w-4 text-rose-500" />
  );
  const progressValue = Math.min(Math.abs(trendValue), 100);

  return (
    <Card className="border border-border/60 shadow-sm backdrop-blur">
      <CardHeader className="pb-4">
        <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </CardDescription>
        <CardTitle className="text-4xl">{num}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className={isPositive ? "text-emerald-500" : "text-rose-500"}>
            {trendValue}%
          </span>
          {trendIcon}
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
      <CardFooter>
        <Progress
          value={progressValue}
          aria-label={`${progressValue}% trend`}
          className="h-2"
        />
      </CardFooter>
    </Card>
  );
}
