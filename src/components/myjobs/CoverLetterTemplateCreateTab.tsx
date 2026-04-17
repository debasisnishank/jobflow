"use client";

import { Label } from "../ui/label";
import { Lightbulb } from "lucide-react";
import { CoverLetterTemplateFields } from "./CoverLetterTemplateFields";

interface CoverLetterTemplateCreateTabProps {
  templateForm: {
    title: string;
    content: string;
    isDefault: boolean;
  };
  setTemplateForm: (form: {
    title: string;
    content: string;
    isDefault: boolean;
  }) => void;
  onUseExample: () => void;
  onCreateClick: () => void;
}

export function CoverLetterTemplateCreateTab({
  templateForm,
  setTemplateForm,
  onUseExample,
  onCreateClick,
}: CoverLetterTemplateCreateTabProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-start gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">Quick Start Guide</p>
            <p className="text-muted-foreground text-xs">
              Write your cover letter structure below. The AI will use this as a
              guide when generating letters. You don't need to write the full
              letter - just provide the structure and style you prefer.
            </p>
          </div>
        </div>
      </div>

      <CoverLetterTemplateFields
        templateForm={templateForm}
        setTemplateForm={setTemplateForm}
      />

      <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
        <input
          type="checkbox"
          id="is-default"
          checked={templateForm.isDefault}
          onChange={(e) =>
            setTemplateForm({
              ...templateForm,
              isDefault: e.target.checked,
            })
          }
          className="h-4 w-4 mt-0.5"
        />
        <div className="flex-1">
          <Label htmlFor="is-default" className="text-sm font-medium cursor-pointer">
            Set as default template
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            This template will be automatically selected when generating new
            cover letters
          </p>
        </div>
      </div>
    </div>
  );
}

