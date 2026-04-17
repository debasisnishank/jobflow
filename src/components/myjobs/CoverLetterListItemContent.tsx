"use client";

import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Trash2, Check } from "lucide-react";
import { CoverLetter } from "@/models/coverLetter.model";

interface CoverLetterListItemContentProps {
  coverLetter: CoverLetter;
  onEdit: (coverLetter: CoverLetter) => void;
  onDelete: () => void;
  onSetAsCurrent: () => void;
}

export function CoverLetterListItemContent({
  coverLetter,
  onEdit,
  onDelete,
  onSetAsCurrent,
}: CoverLetterListItemContentProps) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{coverLetter.title}</h4>
            {coverLetter.isCurrent && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              v{coverLetter.version}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {coverLetter.createdAt &&
              format(new Date(coverLetter.createdAt), "MMM d, yyyy")}
            {coverLetter.template && (
              <span className="ml-2">
                • Template: {coverLetter.template.title}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-1">
          {!coverLetter.isCurrent && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onSetAsCurrent}
              title="Set as current"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(coverLetter)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {coverLetter.isCurrent && (
        <div className="mt-3 p-3 bg-muted rounded-md">
          <p className="text-sm whitespace-pre-wrap line-clamp-4">
            {coverLetter.content}
          </p>
        </div>
      )}
    </div>
  );
}

















