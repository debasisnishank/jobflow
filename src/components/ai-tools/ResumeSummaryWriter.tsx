"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Sparkles, FileText, Copy, Check } from "lucide-react";
import { getResumeList } from "@/actions/profile.actions";
import { Resume } from "@/models/profile.model";
import Loading from "../Loading";
import { toast } from "../ui/use-toast";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type ResumeSummaryWriterProps = {
  preferredResumeId?: string;
};

export function ResumeSummaryWriter({ preferredResumeId }: ResumeSummaryWriterProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadResumes();
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

  const handleGenerate = async () => {
    if (!selectedResumeId) return;

    try {
      setGenerating(true);
      setSummary("");

      const response = await fetch("/api/ai/resume/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: selectedResumeId }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate summary";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedSummary = "";

      try {
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            accumulatedSummary += chunk;
            setSummary(accumulatedSummary);
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate summary";
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
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy summary",
      });
    }
  };

  return (
    <div className="space-y-6">
          {loadingResumes ? (
            <div className="flex items-center justify-center py-8">
              <Loading />
            </div>
          ) : resumes.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No resumes found. Please create a resume first in the Resume Builder.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Card className="border border-border/70">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-base">Generate a professional summary</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pick a resume and generate a concise, ATS-friendly summary you can copy into your resume.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
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
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                disabled={generating || !selectedResumeId}
                className="w-full sm:w-auto bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generating ? "Generating..." : "Generate Summary"}
              </Button>

              {generating && (
                <div className="flex items-center justify-center py-8">
                  <Loading />
                </div>
              )}

              {summary && !generating && (
                <Card className="border border-border/70">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">Generated Summary</CardTitle>
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
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="min-h-[240px] font-mono text-sm"
                      placeholder="Generated summary will appear here..."
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
    </div>
  );
}

