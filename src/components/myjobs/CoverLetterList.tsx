"use client";

import { CardContent } from "../ui/card";
import { FileText } from "lucide-react";
import { CoverLetter } from "@/models/coverLetter.model";
import { CoverLetterListItem } from "./CoverLetterListItem";

interface CoverLetterListProps {
  coverLetters: CoverLetter[];
  onEdit: (coverLetter: CoverLetter) => void;
  onReload: () => void;
}

export function CoverLetterList({
  coverLetters,
  onEdit,
  onReload,
}: CoverLetterListProps) {
  if (coverLetters.length === 0) {
    return (
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No cover letters yet</p>
          <p className="text-sm mt-2">
            Create your first cover letter to get started
          </p>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <div className="space-y-3">
        {coverLetters.map((coverLetter) => (
          <CoverLetterListItem
            key={coverLetter.id}
            coverLetter={coverLetter}
            onEdit={onEdit}
            onReload={onReload}
          />
        ))}
      </div>
    </CardContent>
  );
}

