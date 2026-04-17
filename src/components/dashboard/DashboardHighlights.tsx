import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type DashboardHighlight = {
  id: string;
  title: string;
  value: string;
  helper: string;
};

type DashboardHighlightsProps = {
  highlights: DashboardHighlight[];
};

export default function DashboardHighlights({
  highlights,
}: DashboardHighlightsProps): JSX.Element {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {highlights.map((highlight) => (
        <Card
          key={highlight.id}
          className="relative overflow-hidden border border-border/70 bg-gradient-to-br from-background via-background to-muted/40"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_45%)]" />
          <CardHeader className="relative pb-2">
            <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
              {highlight.title}
            </CardDescription>
            <CardTitle className="text-3xl">{highlight.value}</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-sm text-muted-foreground">{highlight.helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

