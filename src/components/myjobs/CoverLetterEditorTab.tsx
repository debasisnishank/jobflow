"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { CoverLetterTemplate } from "@/models/coverLetter.model";

interface CoverLetterEditorTabProps {
  coverLetterForm: {
    title: string;
    content: string;
    templateId: string;
  };
  setCoverLetterForm: React.Dispatch<React.SetStateAction<{
    title: string;
    content: string;
    templateId: string;
  }>>;
  templates: CoverLetterTemplate[];
}

export function CoverLetterEditorTab({
  coverLetterForm,
  setCoverLetterForm,
  templates,
}: CoverLetterEditorTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={coverLetterForm.title}
          onChange={(e) =>
            setCoverLetterForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          placeholder="e.g., Cover Letter for Software Engineer"
        />
      </div>
      <div>
        <Label htmlFor="template">Template (Optional)</Label>
        <Select
          value={coverLetterForm.templateId || "none"}
          onValueChange={(value) =>
            setCoverLetterForm((prev) => ({
              ...prev,
              templateId: value === "none" ? "" : value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">None</SelectItem>
              {templates
                .filter((template) => template.id)
                .map((template) => (
                  <SelectItem key={template.id} value={template.id!}>
                    {template.title}
                    {template.isDefault && " (Default)"}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="content">
          Content <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="content"
          value={coverLetterForm.content}
          onChange={(e) =>
            setCoverLetterForm((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
          placeholder="Write your cover letter here..."
          className="min-h-[400px] font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Write your cover letter content. You can also generate one using AI in
          the "AI Generate" tab.
        </p>
      </div>
    </div>
  );
}

