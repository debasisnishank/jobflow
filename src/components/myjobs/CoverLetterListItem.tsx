"use client";

import { CoverLetter } from "@/models/coverLetter.model";
import { useCoverLetterActions } from "./hooks/useCoverLetterActions";
import { CoverLetterListItemContent } from "./CoverLetterListItemContent";

interface CoverLetterListItemProps {
  coverLetter: CoverLetter;
  onEdit: (coverLetter: CoverLetter) => void;
  onReload: () => void;
}

export function CoverLetterListItem({
  coverLetter,
  onEdit,
  onReload,
}: CoverLetterListItemProps) {
  const { handleDelete, handleSetAsCurrent } = useCoverLetterActions(onReload);

  return (
    <CoverLetterListItemContent
      coverLetter={coverLetter}
      onEdit={onEdit}
      onDelete={() => handleDelete(coverLetter.id!)}
      onSetAsCurrent={() => handleSetAsCurrent(coverLetter.id!)}
    />
  );
}

