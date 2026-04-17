"use strict";

import { useState, useImperativeHandle } from "react";
import {
  ContactInfo,
  ResumeSection,
} from "@/models/profile.model";
import { AddResumeSectionRef } from "../AddResumeSection";

export function useAddResumeSectionDialogs(
  ref: React.ForwardedRef<AddResumeSectionRef>
) {
  const [contactInfoDialogOpen, setContactInfoDialogOpen] = useState(false);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [contactInfoToEdit, setContactInfoToEdit] =
    useState<ContactInfo | null>(null);
  const [summaryToEdit, setSummaryToEdit] = useState<ResumeSection | null>(
    null
  );
  const [experienceToEdit, setExperienceToEdit] =
    useState<ResumeSection | null>(null);
  const [educationToEdit, setEducationToEdit] =
    useState<ResumeSection | null>(null);

  useImperativeHandle(ref, () => ({
    openContactInfoDialog(contactInfo: ContactInfo) {
      setContactInfoDialogOpen(true);
      setContactInfoToEdit({ ...contactInfo });
    },
    openSummaryDialog(summarySection: ResumeSection) {
      setSummaryDialogOpen(true);
      setSummaryToEdit({ ...summarySection });
    },
    openExperienceDialog(experienceSection: ResumeSection) {
      setExperienceDialogOpen(true);
      setExperienceToEdit({ ...experienceSection });
    },
    openEducationDialog(educationSection: ResumeSection) {
      setEducationDialogOpen(true);
      setEducationToEdit({ ...educationSection });
    },
  }));

  return {
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
  };
}

