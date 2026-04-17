"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus } from "lucide-react";
import { ContactInfoForm } from "./forms/ContactInfoForm";
import { SummaryForm } from "./forms/SummaryForm";
import { WorkExperienceForm } from "./forms/WorkExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";
import { CertificationsForm } from "./forms/CertificationsForm";
import { CustomSectionForm } from "./forms/CustomSectionForm";
import { ResumeFormData } from "./types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeBuilderFormProps {
  formData: ResumeFormData;
  onChange: (updates: Partial<ResumeFormData>) => void;
}

interface SectionConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  defaultOpen?: boolean;
}

export function ResumeBuilderForm({ formData, onChange }: ResumeBuilderFormProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["contact", "summary", "experience"])
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const sections: SectionConfig[] = [
    {
      id: "contact",
      title: "Personal Information",
      icon: null,
      defaultOpen: true,
      component: (
        <ContactInfoForm
          data={formData.contactInfo}
          onChange={(contactInfo) => onChange({ contactInfo })}
        />
      ),
    },
    {
      id: "summary",
      title: "Professional Summaries",
      icon: null,
      defaultOpen: true,
      component: (
        <SummaryForm
          data={formData.summary}
          onChange={(summary) => onChange({ summary })}
          resumeId={formData.id}
        />
      ),
    },
    {
      id: "experience",
      title: "Work Experience",
      icon: null,
      defaultOpen: true,
      component: (
        <WorkExperienceForm
          data={formData.workExperiences}
          onChange={(workExperiences) => onChange({ workExperiences })}
        />
      ),
    },
    {
      id: "skills",
      title: "Skills & Interests",
      icon: null,
      component: (
        <SkillsForm
          data={formData.skills}
          onChange={(skills) => onChange({ skills })}
        />
      ),
    },
    {
      id: "education",
      title: "Education",
      icon: null,
      component: (
        <EducationForm
          data={formData.educations}
          onChange={(educations) => onChange({ educations })}
        />
      ),
    },
    {
      id: "certifications",
      title: "Certifications",
      icon: null,
      component: (
        <CertificationsForm
          data={formData.certifications}
          onChange={(certifications) => onChange({ certifications })}
        />
      ),
    },
    {
      id: "custom",
      title: "Custom Sections",
      icon: null,
      component: (
        <CustomSectionForm
          data={formData.customSections || []}
          onChange={(customSections) => onChange({ customSections })}
        />
      ),
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-4 space-y-1">
        {sections.map((section) => {
          const isOpen = openSections.has(section.id);
          return (
            <div
              key={section.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{section.title}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {isOpen && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  {section.component}
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}
