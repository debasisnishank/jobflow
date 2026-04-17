"use client";

import AddContactInfo from "./AddContactInfo";
import AddResumeSummary from "./AddResumeSummary";
import AddExperience from "./AddExperience";
import AddEducation from "./AddEducation";
import {
  ContactInfo,
  Resume,
  ResumeSection,
} from "@/models/profile.model";

interface AddResumeSectionDialogsProps {
  resume: Resume;
  contactInfoDialogOpen: boolean;
  setContactInfoDialogOpen: (open: boolean) => void;
  summaryDialogOpen: boolean;
  setSummaryDialogOpen: (open: boolean) => void;
  experienceDialogOpen: boolean;
  setExperienceDialogOpen: (open: boolean) => void;
  educationDialogOpen: boolean;
  setEducationDialogOpen: (open: boolean) => void;
  contactInfoToEdit: ContactInfo | null;
  summaryToEdit: ResumeSection | null;
  experienceToEdit: ResumeSection | null;
  educationToEdit: ResumeSection | null;
  experienceSectionId?: string;
  educationSectionId?: string;
}

export function AddResumeSectionDialogs({
  resume,
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
  experienceSectionId,
  educationSectionId,
}: AddResumeSectionDialogsProps) {
  return (
    <>
      <AddContactInfo
        resumeId={resume?.id}
        dialogOpen={contactInfoDialogOpen}
        setDialogOpen={setContactInfoDialogOpen}
        contactInfoToEdit={contactInfoToEdit}
      />
      <AddResumeSummary
        resumeId={resume?.id}
        dialogOpen={summaryDialogOpen}
        setDialogOpen={setSummaryDialogOpen}
        summaryToEdit={summaryToEdit}
      />
      <AddExperience
        resumeId={resume?.id}
        sectionId={experienceSectionId}
        dialogOpen={experienceDialogOpen}
        setDialogOpen={setExperienceDialogOpen}
        experienceToEdit={experienceToEdit!}
      />
      <AddEducation
        resumeId={resume?.id}
        sectionId={educationSectionId}
        dialogOpen={educationDialogOpen}
        setDialogOpen={setEducationDialogOpen}
        educationToEdit={educationToEdit!}
      />
    </>
  );
}

















