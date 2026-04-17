"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "./ResumePreview";
import { ResumeFormData } from "./types";
import { getResumeById } from "@/actions/profile.actions";

interface ResumePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

export function ResumePreviewDialog({ open, onOpenChange, resumeId }: ResumePreviewDialogProps) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ResumeFormData | null>(null);
  const [template, setTemplate] = useState("modern");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");

  useEffect(() => {
    if (open && resumeId) {
      loadResume();
    }
  }, [open, resumeId]);

  const loadResume = async () => {
    setLoading(true);
    try {
      const resume = await getResumeById(resumeId);

      if (!resume) {
        return;
      }

      const data: ResumeFormData = {
        id: resume.id,
        title: resume.title || "Untitled Resume",
        template: resume.template || "modern",
        primaryColor: resume.primaryColor || "#3B82F6",
        contactInfo: {
          firstName: resume.ContactInfo?.firstName || "",
          lastName: resume.ContactInfo?.lastName || "",
          email: resume.ContactInfo?.email || "",
          phone: resume.ContactInfo?.phone || "",
          address: resume.ContactInfo?.address || "",
          headline: resume.ContactInfo?.headline || "",
        },
        summary: resume.ResumeSections?.find((s: any) => s.sectionType === "summary")?.summary?.content || "",
        workExperiences: resume.ResumeSections?.flatMap((s: any) =>
          s.workExperiences?.map((w: any) => ({
            id: w.id,
            company: w.Company?.label || "",
            jobTitle: w.jobTitle?.label || "",
            location: w.location?.label || "",
            startDate: w.startDate ? new Date(w.startDate).toISOString().split('T')[0] : "",
            endDate: w.endDate ? new Date(w.endDate).toISOString().split('T')[0] : undefined,
            description: w.description || "",
            current: !w.endDate,
          })) || []
        ) || [],
        educations: resume.ResumeSections?.flatMap((s: any) =>
          s.educations?.map((e: any) => ({
            id: e.id,
            institution: e.institution || "",
            degree: e.degree || "",
            fieldOfStudy: e.fieldOfStudy || "",
            location: e.location?.label || "",
            startDate: e.startDate ? new Date(e.startDate).toISOString().split('T')[0] : "",
            endDate: e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : undefined,
            description: e.description || "",
          })) || []
        ) || [],
        skills: (resume as any).Skills?.map((s: any) => ({
          id: s.id,
          name: s.name || "",
          level: s.level || "",
          category: s.category || "",
        })) || [],
        certifications: resume.ResumeSections?.flatMap((s: any) =>
          s.licenseOrCertifications?.map((c: any) => ({
            id: c.id,
            title: c.title || "",
            organization: c.organization || "",
            issueDate: c.issueDate ? new Date(c.issueDate).toISOString().split('T')[0] : undefined,
            expirationDate: c.expirationDate ? new Date(c.expirationDate).toISOString().split('T')[0] : undefined,
            credentialUrl: c.credentialUrl || "",
          })) || []
        ) || [],
        customSections: resume.ResumeSections?.flatMap((s: any) =>
          s.others?.map((o: any) => ({
            id: o.id,
            sectionId: s.id,
            title: o.title || "",
            content: o.content || "",
          })) || []
        ) || [],
      };

      setFormData(data);
      setTemplate(data.template);
      setPrimaryColor(data.primaryColor);
    } catch (error) {
      console.error("Failed to load resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 flex flex-col translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">Resume Preview</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-100 p-8 flex items-center justify-center min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
            </div>
          ) : formData ? (
            <ResumePreview
              formData={formData}
              template={template}
              primaryColor={primaryColor}
            />
          ) : (
            <div className="text-center text-gray-500">
              <p>Failed to load resume preview</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

