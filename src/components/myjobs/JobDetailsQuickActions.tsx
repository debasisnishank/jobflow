"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatUrl } from "@/lib/utils";
import { JobResponse } from "@/models/job.model";
import { ExternalLink, FileText } from "lucide-react";

interface JobDetailsQuickActionsProps {
  job: JobResponse;
  onDownloadResume: () => void;
}

export function JobDetailsQuickActions({
  job,
  onDownloadResume,
}: JobDetailsQuickActionsProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {job.jobUrl && (
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <a
              href={formatUrl(job.jobUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              View Job Posting
            </a>
          </Button>
        )}
        {job?.Resume && job?.Resume?.File && job.Resume?.File?.id && (
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={onDownloadResume}
            >
              <FileText className="h-4 w-4" />
              Download Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

















