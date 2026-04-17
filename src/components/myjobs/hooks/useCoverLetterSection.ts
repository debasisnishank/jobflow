"use strict";

import { useState, useEffect } from "react";
import { getCoverLettersByJobId, getCoverLetterTemplates } from "@/actions/coverLetter.actions";
import { getResumeList } from "@/actions/profile.actions";
import { CoverLetter, CoverLetterTemplate } from "@/models/coverLetter.model";
import { Resume } from "@/models/profile.model";
import { toast } from "@/components/ui/use-toast";

export function useCoverLetterSection(jobId: string, resume?: Resume) {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [templates, setTemplates] = useState<CoverLetterTemplate[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const loadCoverLetters = async () => {
    try {
      const result = await getCoverLettersByJobId(jobId);
      if (result.success && result.coverLetters) {
        setCoverLetters(result.coverLetters);
      }
    } catch (error) {
      setCoverLetters([]);
    }
  };

  const loadTemplates = async () => {
    try {
      const result = await getCoverLetterTemplates();
      if (result.success && result.templates) {
        setTemplates(result.templates);
        const defaultTemplate = result.templates.find((t) => t.isDefault);
        if (defaultTemplate) {
          setSelectedTemplateId(defaultTemplate.id || "");
        }
      }
    } catch (error) {
      setTemplates([]);
    }
  };

  const loadResumes = async () => {
    try {
      const result = await getResumeList();
      if (result.success && result.data) {
        setResumes(result.data);
        if (resume && result.data.find((r: { id: string }) => r.id === resume.id) && resume.id) {
          setSelectedResumeId(resume.id);
        } else if (result.data.length > 0 && result.data[0].id) {
          setSelectedResumeId(result.data[0].id);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load resumes",
      });
    }
  };

  useEffect(() => {
    loadCoverLetters();
    loadTemplates();
    loadResumes();
  }, [jobId]);

  return {
    coverLetters,
    templates,
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    selectedTemplateId,
    setSelectedTemplateId,
    loadCoverLetters,
    loadTemplates,
  };
}

