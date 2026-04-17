"use client";

import { useMemo } from "react";
import { CircularProgress } from "./ui/CircularProgress";
import { ResumeFormData } from "./types";

interface ResumeScorePanelProps {
  formData: ResumeFormData;
  jobDescription?: string;
}

export function ResumeScorePanel({ formData, jobDescription }: ResumeScorePanelProps) {
  const resumeScore = useMemo(() => {
    let score = 0;
    let maxScore = 0;

    const checkField = (value: any, weight: number) => {
      maxScore += weight;
      if (value && (typeof value === "string" ? value.trim() : value)) {
        score += weight;
      }
    };

    checkField(formData.contactInfo?.firstName, 5);
    checkField(formData.contactInfo?.lastName, 5);
    checkField(formData.contactInfo?.email, 10);
    checkField(formData.contactInfo?.phone, 5);
    checkField(formData.contactInfo?.headline, 5);
    checkField(formData.summary, 15);
    checkField(formData.workExperiences?.length > 0, 20);
    checkField(formData.educations?.length > 0, 15);
    checkField(formData.skills?.length > 0, 10);
    checkField(formData.certifications?.length > 0, 10);

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }, [formData]);

  const skillMatch = useMemo(() => {
    if (!jobDescription || !jobDescription.trim()) {
      return null;
    }

    if (!formData.skills || formData.skills.length === 0) {
      return 0;
    }

    const jobDescLower = jobDescription.toLowerCase();
    const resumeSkills = formData.skills.map((s) => s.name.toLowerCase().trim());

    const commonTechTerms = [
      "javascript", "typescript", "python", "java", "react", "node", "angular", "vue",
      "sql", "mongodb", "postgresql", "mysql", "aws", "docker", "kubernetes", "git",
      "html", "css", "sass", "less", "redux", "graphql", "rest", "api", "agile", "scrum"
    ];

    const jobKeywords = new Set<string>();

    commonTechTerms.forEach(term => {
      if (jobDescLower.includes(term)) {
        jobKeywords.add(term);
      }
    });

    const words = jobDescLower.match(/\b[a-z]{4,}\b/gi) || [];
    words.forEach(word => {
      if (word.length >= 4) {
        jobKeywords.add(word.toLowerCase());
      }
    });

    const matchedSkills = resumeSkills.filter((skill) => {
      const skillWords = skill.split(/[\s-]+/);
      return skillWords.some(skillWord => {
        if (skillWord.length < 3) return false;
        return Array.from(jobKeywords).some(keyword => {
          return keyword.includes(skillWord) || skillWord.includes(keyword) ||
            keyword === skillWord || skill === keyword;
        });
      });
    });

    const matchPercentage = resumeSkills.length > 0
      ? Math.round((matchedSkills.length / resumeSkills.length) * 100)
      : 0;

    return Math.min(matchPercentage, 100);
  }, [jobDescription, formData.skills]);

  return (
    <div className="p-2 space-y-3">
      <CircularProgress
        value={resumeScore}
        max={100}
        size={80}
        strokeWidth={6}
        label="Resume Score"
      />
      {skillMatch !== null && (
        <CircularProgress
          value={skillMatch}
          max={100}
          size={80}
          strokeWidth={6}
          label="Skill Match"
        />
      )}
    </div>
  );
}

