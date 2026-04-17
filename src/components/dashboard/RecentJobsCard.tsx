import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { appConfig } from "@/lib/config/app.config";

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

export default function RecentJobsCard({
  jobs,
}: {
  jobs: RecentJob[];
}): JSX.Element {
  return (
    <Card className="mb-2 border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Jobs Applied</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent applications yet. Add a job to start building momentum.
          </p>
        ) : (
          jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/myjobs/${job?.id}`}
              className="group flex items-center gap-4 rounded-xl border border-transparent bg-muted/40 p-3 transition hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/5"
            >
              <Avatar className="hidden h-10 w-10 sm:flex">
                <AvatarImage
                  src={appConfig.logoPath}
                  alt={job.Company?.label || "Company logo"}
                />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-semibold leading-none group-hover:text-[#3B82F6] transition-colors">
                  {job.JobTitle?.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {job.Company?.label}
                </p>
              </div>
              <div className="ml-auto text-xs uppercase tracking-wide text-muted-foreground">
                {job?.appliedDate ? format(job.appliedDate, "PP") : "—"}
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
