"use client";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { forwardRef } from "react";
import {
  ContactInfo,
  Resume,
  ResumeSection,
  SectionType,
} from "@/models/profile.model";
import { useAddResumeSectionDialogs } from "./hooks/useAddResumeSectionDialogs";
import { AddResumeSectionDialogs } from "./AddResumeSectionDialogs";
import { AddResumeSectionMenu } from "./AddResumeSectionMenu";

interface AddResumeSectionProps {
  resume: Resume;
}

export interface AddResumeSectionRef {
  openContactInfoDialog: (c: ContactInfo) => void;
  openSummaryDialog: (s: ResumeSection) => void;
  openExperienceDialog: (s: ResumeSection) => void;
  openEducationDialog: (s: ResumeSection) => void;
}

const AddResumeSection = forwardRef<AddResumeSectionRef, AddResumeSectionProps>(
  ({ resume }, ref) => {
    const {
      contactInfoDialogOpen,
      setContactInfoDialogOpen,
      summaryDialogOpen,
      setSummaryDialogOpen,
      experienceDialogOpen,
      setExperienceDialogOpen,
      educationDialogOpen,
      setEducationDialogOpen,
      contactInfoToEdit,
      summaryToEdit,
      experienceToEdit,
      educationToEdit,
      setExperienceToEdit,
      setEducationToEdit,
    } = useAddResumeSectionDialogs(ref);

    const experienceSection = resume?.ResumeSections?.find(
      (section) => section.sectionType === SectionType.EXPERIENCE
    );
    const educationSection = resume?.ResumeSections?.find(
      (section) => section.sectionType === SectionType.EDUCATION
    );

    const openContactInfoDialog = () => setContactInfoDialogOpen(true);
    const openSummaryDialog = () => setSummaryDialogOpen(true);
    const openExperienceDialog = () => {
      if (experienceToEdit) {
        setExperienceToEdit(null);
      }
      setExperienceDialogOpen(true);
    };
    const openEducationDialog = () => {
      if (educationToEdit) {
        setEducationToEdit(null);
      }
      setEducationDialogOpen(true);
    };

    return (
      <>
        <AddResumeSectionMenu
          resume={resume}
          onOpenContactInfo={openContactInfoDialog}
          onOpenSummary={openSummaryDialog}
          onOpenExperience={openExperienceDialog}
          onOpenEducation={openEducationDialog}
        />
        <AddResumeSectionDialogs
          resume={resume}
          contactInfoDialogOpen={contactInfoDialogOpen}
          setContactInfoDialogOpen={setContactInfoDialogOpen}
          summaryDialogOpen={summaryDialogOpen}
          setSummaryDialogOpen={setSummaryDialogOpen}
          experienceDialogOpen={experienceDialogOpen}
          setExperienceDialogOpen={setExperienceDialogOpen}
          educationDialogOpen={educationDialogOpen}
          setEducationDialogOpen={setEducationDialogOpen}
          contactInfoToEdit={contactInfoToEdit}
          summaryToEdit={summaryToEdit}
          experienceToEdit={experienceToEdit}
          educationToEdit={educationToEdit}
          experienceSectionId={experienceSection?.id}
          educationSectionId={educationSection?.id}
        />
      </>
    );
  }
);

AddResumeSection.displayName = "AddResumeSection";

export default AddResumeSection;
