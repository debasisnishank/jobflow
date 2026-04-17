"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Loader2, FileText, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getResumeList } from "@/actions/profile.actions";
import { Resume } from "@/models/profile.model";

interface JobTailoredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobTailoredDialog({ open, onOpenChange }: JobTailoredDialogProps) {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if (open) {
      loadResumes();
    }
  }, [open]);

  const loadResumes = async () => {
    setLoadingResumes(true);
    try {
      const { data, success } = await getResumeList(1, 100);
      if (success && data) {
        setResumes(data);
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedResumeId) {
      toast({
        variant: "destructive",
        title: "Select a resume",
        description: "Please select a base resume to tailor for this job",
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Add job description",
        description: "Please paste the job description to optimize your resume",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/resume/tailor-for-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseResumeId: selectedResumeId,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tailored resume");
      }

      const { resumeId } = await response.json();

      toast({
        title: "Resume Tailored!",
        description: "AI has optimized your resume for this job. Opening editor...",
        variant: "success",
      });

      setTimeout(() => {
        const params = new URLSearchParams();
        if (jobDescription.trim()) {
          params.set("jobDescription", jobDescription.trim());
        }
        router.push(`/dashboard/resume-builder/${resumeId}${params.toString() ? `?${params.toString()}` : ""}`);
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Failed to tailor resume. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Job-Tailored Resume
          </DialogTitle>
          <DialogDescription>
            Select a base resume and add the job description to optimize
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Base Resume</Label>
            {loadingResumes ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#3B82F6]" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="p-6 border-2 border-dashed rounded-lg text-center">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  No resumes found. Create a base resume first.
                </p>
              </div>
            ) : (
              <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Choose a resume to optimize" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id!}>
                      {resume.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Job Description</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here...

We're looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and cloud technologies..."
              rows={10}
              className="bg-white border-gray-300 font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              AI will optimize your resume to match this job's requirements
            </p>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">
              <Target className="h-4 w-4 inline mr-1" />
              AI will optimize:
            </h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Highlight relevant skills and experience</li>
              <li>• Match keywords from job description</li>
              <li>• Reorder sections for maximum impact</li>
              <li>• Suggest improvements for ATS compatibility</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={loading || !selectedResumeId || !jobDescription.trim()}
              className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Tailoring...
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Create Tailored Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

