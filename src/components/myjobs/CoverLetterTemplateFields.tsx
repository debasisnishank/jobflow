"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { CoverLetterTemplatePlaceholders } from "./CoverLetterTemplatePlaceholders";

interface CoverLetterTemplateFieldsProps {
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
}

export function CoverLetterTemplateFields({
  templateForm,
  setTemplateForm,
}: CoverLetterTemplateFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="template-title" className="flex items-center gap-2">
          Template Title
          <span className="text-xs text-muted-foreground font-normal">
            (e.g., "Software Engineer Template" or "Marketing Professional Template")
          </span>
        </Label>
        <Input
          id="template-title"
          value={templateForm.title}
          onChange={(e) =>
            setTemplateForm({ ...templateForm, title: e.target.value })
          }
          placeholder="e.g., Software Engineer Template"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Give your template a descriptive name so you can easily identify it later
        </p>
      </div>
      <div>
        <Label
          htmlFor="template-content"
          className="flex items-center gap-2 mb-2"
        >
          Template Content
          <Badge variant="outline" className="text-xs">
            Optional but recommended
          </Badge>
        </Label>
        <Textarea
          id="template-content"
          value={templateForm.content}
          onChange={(e) =>
            setTemplateForm({ ...templateForm, content: e.target.value })
          }
          placeholder={`Example structure:

Dear Hiring Manager,

I am writing to express my interest in the [JOB_TITLE] position at [COMPANY_NAME]. With my background in [RELEVANT_SKILL], I am excited about the opportunity to contribute to your team.

[PARAGRAPH_ABOUT_EXPERIENCE]

[PARAGRAPH_ABOUT_MOTIVATION]

Thank you for considering my application. I look forward to discussing how my skills align with your needs.

Best regards,
[YOUR_NAME]`}
          className="min-h-[300px] font-mono text-sm"
        />
        <div className="mt-2 space-y-2">
          <CoverLetterTemplatePlaceholders />
        </div>
      </div>
    </>
  );
}

