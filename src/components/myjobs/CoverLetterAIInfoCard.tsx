"use client";

import { Info } from "lucide-react";

export function CoverLetterAIInfoCard() {
  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900 dark:text-blue-100">
          <p className="font-medium mb-1">AI Cover Letter Generation</p>
          <p className="text-xs">
            Select a resume and optionally a template. AI will generate a
            personalized cover letter using OpenAI. You can edit the generated
            content before saving.
          </p>
        </div>
      </div>
    </div>
  );
}

















