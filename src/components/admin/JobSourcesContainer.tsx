"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { APP_CONSTANTS } from "@/lib/constants";
import Loading from "../Loading";
import { Button } from "../ui/button";
import { LinkIcon } from "lucide-react";
import JobSourcesTable from "./JobSourcesTable";
import AddJobSource from "./AddJobSource";
import { getJobSourceList } from "@/actions/job.actions";
import { JobSource } from "@/models/job.model";

type JobSourceWithCount = JobSource & {
  _count?: {
    jobsApplied: number;
  };
};

export default function JobSourcesContainer() {
  const [sources, setSources] = useState<JobSourceWithCount[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSources = useCallback(async () => {
    setLoading(true);
    const list = await getJobSourceList(true);
    if (Array.isArray(list)) {
      setSources(list);
    } else {
      setSources([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Job Sources
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track where your opportunities originate from.
            </p>
          </div>
          <AddJobSource reloadSources={loadSources} />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading && <Loading />}
        {!loading && sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-muted/50 p-6 mb-4">
              <LinkIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No job sources yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Add the platforms where you usually discover job opportunities to
              keep your analytics accurate.
            </p>
            <AddJobSource reloadSources={loadSources} />
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <JobSourcesTable
                sources={sources}
                reloadSources={loadSources}
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Showing{" "}
              <strong className="text-foreground">{sources.length}</strong>{" "}
              sources.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

