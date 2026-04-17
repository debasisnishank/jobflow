"use client";

import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { JobResponse } from "@/models/job.model";
import { CompanyAvatar } from "../ui/CompanyAvatar";
import { MapPin, Briefcase, ExternalLink, Clock, DollarSign } from "lucide-react";
import { CURRENCIES } from "@/lib/data/currencyData";
import { SALARY_RANGES } from "@/lib/data/salaryRangeData";

interface JobHeaderCardProps {
  job: JobResponse;
  isExpired: boolean;
  getJobType: (code: string) => string;
  getStatusBadgeColor: (statusValue?: string) => string;
}

export function JobHeaderCard({
  job,
  isExpired,
  getJobType,
  getStatusBadgeColor,
}: JobHeaderCardProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <div className="flex items-start gap-4">
          <CompanyAvatar
            src={job?.Company?.logoUrl}
            alt={job?.Company?.label || "Company logo"}
            fallbackText={job?.Company?.label?.charAt(0).toUpperCase() || "C"}
            size="lg"
            className="border-2"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="text-base font-medium text-foreground mb-1">
                  {job?.Company?.label}
                </CardDescription>
                <CardTitle className="text-2xl">
                  {job?.JobTitle?.label}
                </CardTitle>
              </div>
              <div className="flex flex-col items-end gap-2">
                {isExpired ? (
                  <Badge className="bg-red-500 text-white">Expired</Badge>
                ) : (
                  <Badge
                    className={cn("text-white", getStatusBadgeColor(job.Status?.value))}
                  >
                    {job.Status?.label}
                  </Badge>
                )}
                {job?.appliedDate && (
                  <span className="text-xs text-muted-foreground">
                    Applied {format(new Date(job.appliedDate), "MMM d, yyyy")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {job?.Location?.label && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {job.Location.label}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {getJobType(job?.jobType)}
            </span>
          </div>
          {job?.JobSource?.label && (
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Source: {job.JobSource.label}
              </span>
            </div>
          )}
          {job?.dueDate && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Due: {format(new Date(job.dueDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>
        {job?.salaryRange && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {job.salaryCurrency === "USD" && (
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">
              {(() => {
                const currency = CURRENCIES.find((c) => c.id === (job.salaryCurrency || "USD"));
                const salaryRange = SALARY_RANGES.find((r) => r.id === job.salaryRange);
                const currencyDisplay = currency?.value || job.salaryCurrency || "USD";
                const salaryDisplay = salaryRange?.value || job.salaryRange;
                return `${currencyDisplay} ${salaryDisplay}`;
              })()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

