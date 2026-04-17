"use client";

import { CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle, Sparkles } from "lucide-react";

interface ResumeBuilderHeaderProps {
  onCreateResume: () => void;
}

export function ResumeBuilderHeader({ onCreateResume }: ResumeBuilderHeaderProps) {
  return (
    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            AI Resume Builder
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Create professional, ATS-friendly resumes with AI-powered assistance
          </p>
        </div>
        <div className="flex items-center">
          <Button
            size="sm"
            className="h-9 gap-2 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white hover:from-[#2563EB] hover:to-[#1E3A8A] shadow-sm"
            onClick={onCreateResume}
          >
            <Sparkles className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create New Resume
            </span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}

