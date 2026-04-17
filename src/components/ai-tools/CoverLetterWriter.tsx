"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { PenTool, Copy, Check, AlertCircle } from "lucide-react";
import { getResumeList } from "@/actions/profile.actions";
import { getJobsList } from "@/actions/job.actions";
import { Resume } from "@/models/profile.model";
import Loading from "../Loading";
import { toast } from "../ui/use-toast";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CoverLetterWriterProps = {
  preferredResumeId?: string;
};

export function CoverLetterWriter({ preferredResumeId }: CoverLetterWriterProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Array<{ id: string; JobTitle: { label: string }; Company: { label: string } }>>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadResumes();
    loadJobs();
  }, []);

  const loadResumes = async () => {
    try {
      setLoadingResumes(true);
      const result = await getResumeList(1, 100);
      if (result?.success && result.data) {
        const data = result.data as Resume[];
        setResumes(data);
        const preferred =
          preferredResumeId && data.some((r) => r.id === preferredResumeId)
            ? preferredResumeId
            : data[0]?.id;
        if (preferred && !selectedResumeId) setSelectedResumeId(preferred);
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoadingResumes(false);
    }
  };

  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      const result = await getJobsList(1, 100);
      if (result?.success && result.data) {
        setJobs(result.data);
        if (result.data.length > 0 && !selectedJobId) {
          setSelectedJobId(result.data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedResumeId || !selectedJobId) return;

    try {
      setGenerating(true);
      setCoverLetter("");

      const response = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          jobId: selectedJobId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate cover letter");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: !done });
        accumulatedContent += chunk;
        setCoverLetter(accumulatedContent);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate cover letter";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Cover letter copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy cover letter",
      });
    }
  };

  const isLoading = loadingResumes || loadingJobs;
  const hasNoData = resumes.length === 0 || jobs.length === 0;

  return (
    <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loading />
            </div>
          ) : hasNoData ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {resumes.length === 0 && jobs.length === 0
                  ? "Please create a resume and add a job application first."
                  : resumes.length === 0
                  ? "No resumes found. Please create a resume first in the Resume Builder."
                  : "No jobs found. Please add a job application first."}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Card className="border border-border/70">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-base">Generate a tailored cover letter</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select your resume and a job application. We’ll draft a cover letter tailored to the role.
                  </p>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Select Resume</Label>
                    <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {resumes.map((resume) => {
                          const resumeId = resume.id ?? "";
                          const title = resume.title ?? "Untitled Resume";
                          return (
                            <SelectItem key={resumeId} value={resumeId}>
                              {title}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Job</Label>
                    <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => {
                          const jobId = job.id ?? "";
                          return (
                            <SelectItem key={jobId} value={jobId}>
                              {job.JobTitle.label} at {job.Company.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                disabled={generating || !selectedResumeId || !selectedJobId}
                className="w-full sm:w-auto bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
              >
                <PenTool className="h-4 w-4 mr-2" />
                {generating ? "Generating..." : "Generate Cover Letter"}
              </Button>

              {generating && (
                <div className="flex items-center justify-center py-8">
                  <Loading />
                </div>
              )}

              {coverLetter && !generating && (
                <Card className="border border-border/70">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">Generated Cover Letter</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="min-h-[440px] font-mono text-sm"
                      placeholder="Generated cover letter will appear here..."
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
    </div>
  );
}

