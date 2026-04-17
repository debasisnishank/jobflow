"use client";

import { Button } from "../ui/button";
import { PlusCircle, Paperclip } from "lucide-react";

interface ProfileEmptyStateProps {
  onCreateResume: () => void;
}

export function ProfileEmptyState({ onCreateResume }: ProfileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted/50 p-6 mb-4">
        <Paperclip className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Create your first resume to start tracking your professional profile.
      </p>
      <Button
        size="sm"
        className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        onClick={onCreateResume}
      >
        <PlusCircle className="h-4 w-4" />
        Create Resume
      </Button>
    </div>
  );
}

















