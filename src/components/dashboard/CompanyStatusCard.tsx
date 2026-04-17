"use strict";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CompanyAvatar } from "@/components/ui/CompanyAvatar";

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

export default function CompanyStatusCard({
  companyStats,
}: {
  companyStats: CompanyStats;
}): JSX.Element {
  const { totalCompanies, topCompanies, companiesWithApplications } =
    companyStats;

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total Companies
            </p>
            <p className="text-2xl font-bold">{totalCompanies}</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              With Applications
            </p>
            <p className="text-2xl font-bold">{companiesWithApplications}</p>
          </div>
        </div>

        {topCompanies.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Top Companies by Applications
            </p>
            <div className="space-y-2">
              {topCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-3 rounded-lg border bg-muted/40 p-2"
                >
                  <CompanyAvatar
                    src={company.logoUrl}
                    alt={company.label}
                    fallbackText={company.label.charAt(0).toUpperCase()}
                    size="sm"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{company.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {company.applicationsCount}{" "}
                      {company.applicationsCount === 1
                        ? "application"
                        : "applications"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No company applications yet. Start applying to track company
            statistics.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

