"use client";

import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Resume } from "@/models/profile.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";

interface CoverLetterAISelectsProps {
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  resumes: Resume[];
  templates: CoverLetterTemplate[];
}

export function CoverLetterAISelects({
  selectedResumeId,
  setSelectedResumeId,
  selectedTemplateId,
  setSelectedTemplateId,
  resumes,
  templates,
}: CoverLetterAISelectsProps) {
  return (
    <>
      <div>
        <Label htmlFor="resume-select">
          Select Resume <span className="text-red-500">*</span>
        </Label>
        <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a resume" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {resumes
                .filter((resume) => resume.id)
                .map((resume) => (
                  <SelectItem key={resume.id} value={resume.id!}>
                    {resume.title}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="template-select">Template (Optional)</Label>
        <Select
          value={selectedTemplateId || "none"}
          onValueChange={(value) =>
            setSelectedTemplateId(value === "none" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">None</SelectItem>
              {templates
                .filter((template) => template.id)
                .map((template) => (
                  <SelectItem key={template.id} value={template.id!}>
                    {template.title}
                    {template.isDefault && " (Default)"}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

















