"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sparkles, FileText, AlertCircle } from "lucide-react";
import { useResumeReviewStream } from "../profile/hooks/useResumeReviewStream";
import { AiModel, defaultModel } from "@/models/ai.model";
import { getFromLocalStorage } from "@/utils/localstorage.utils";
import { getResumeList } from "@/actions/profile.actions";
import { Resume } from "@/models/profile.model";
import Loading from "../Loading";
import { AiResumeReviewResponseContent } from "../profile/AiResumeReviewResponseContent";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

type ResumeAnalysisProps = {
  preferredResumeId?: string;
};

export function ResumeAnalysis({ preferredResumeId }: ResumeAnalysisProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const selectedModel: AiModel = getFromLocalStorage("aiSettings", defaultModel);
  const { aIContent, loading, isStreaming, getResumeReview, abortStream } = useResumeReviewStream();

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

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  const handleAnalyze = () => {
    if (selectedResume) {
      getResumeReview(selectedResume, selectedModel);
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
                    <CardTitle className="text-base">Select a resume to analyze</CardTitle>
                  </div>
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
                          const title = resume.title ?? "Untitled Resume";
                          const resumeId = resume.id ?? "";
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

              {selectedResume && selectedResume.ResumeSections && selectedResume.ResumeSections.length < 2 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Resume needs at least 2 sections to generate analysis. Please add more content to your resume.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={loading || isStreaming || !selectedResume || (selectedResume.ResumeSections?.length || 0) < 2}
                className="w-full sm:w-auto bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {loading || isStreaming ? "Analyzing..." : "Analyze Resume"}
              </Button>

              {(loading || isStreaming) && (
                <div className="flex items-center justify-center py-8">
                  <Loading />
                </div>
              )}

              {aIContent && !loading && !isStreaming && (
                <Card className="border border-border/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Analysis results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AiResumeReviewResponseContent
                      content={typeof aIContent === "string" ? aIContent : JSON.stringify(aIContent)}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
    </div>
  );
}

