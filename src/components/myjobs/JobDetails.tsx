"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { JobResponse } from "@/models/job.model";
import { AiJobMatchSection } from "../profile/AiJobMatchSection";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";
import { TipTapContentViewer } from "../TipTapContentViewer";
import { CoverLetterSection } from "./CoverLetterSection";
import { JobHeaderCard } from "./JobHeaderCard";
import { JobDetailsSidebar } from "./JobDetailsSidebar";
import { InterviewsSection } from "../interviews/InterviewsSection";

function JobDetails({ job }: { job: JobResponse }) {
  const [aiSectionOpen, setAiSectionOpen] = useState(false);
  const router = useRouter();
  const goBack = () => router.back();
  const getAiJobMatch = async () => {
    setAiSectionOpen(true);
  };
  
  const getJobType = (code: string): string => {
    switch (code) {
      case "FT":
        return "Full-time";
      case "PT":
        return "Part-time";
      case "C":
        return "Contract";
      default:
        return "Unknown";
    }
  };
  
  const isExpired =
    !!(job.dueDate && new Date() > new Date(job.dueDate) && job.Status?.value === "draft");

  const getStatusBadgeColor = (statusValue?: string): string => {
    switch (statusValue) {
      case "applied":
        return "bg-cyan-500 hover:bg-cyan-600";
      case "interview":
        return "bg-green-500 hover:bg-green-600";
      case "offer":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
      case "withdrawn":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          title="Go Back"
          size="sm"
          variant="outline"
          onClick={goBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={getAiJobMatch}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Match with AI</span>
          <span className="sm:hidden">AI Match</span>
        </Button>
      </div>

      {job?.id && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <JobHeaderCard
              job={job}
              isExpired={isExpired}
              getJobType={getJobType}
              getStatusBadgeColor={getStatusBadgeColor}
            />
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <TipTapContentViewer content={job?.description} />
                </div>
              </CardContent>
            </Card>
            <CoverLetterSection jobId={job.id} resume={job.Resume} />
            <InterviewsSection jobId={job.id} />
          </div>
          <JobDetailsSidebar job={job} isExpired={isExpired} />
        </div>
      )}

      <AiJobMatchSection
        jobId={job?.id}
        aISectionOpen={aiSectionOpen}
        triggerChange={setAiSectionOpen}
      />
    </div>
  );
}

export default JobDetails;
