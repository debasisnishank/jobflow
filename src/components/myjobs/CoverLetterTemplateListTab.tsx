"use client";

import { Button } from "../ui/button";
import { FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { CoverLetterTemplate } from "@/models/coverLetter.model";

interface CoverLetterTemplateListTabProps {
  templates: CoverLetterTemplate[];
  onCreateClick: () => void;
}

export function CoverLetterTemplateListTab({
  templates,
  onCreateClick,
}: CoverLetterTemplateListTabProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
        <p className="text-sm font-medium mb-2">No templates yet</p>
        <p className="text-xs text-muted-foreground mb-4">
          Create your first template to speed up cover letter generation
        </p>
        <Button variant="outline" size="sm" onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Template
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{template.title}</CardTitle>
              {template.isDefault && <Badge variant="default">Default</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
              {template.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

















