"use client";

import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CoverLetter } from "@/models/coverLetter.model";
import { Resume } from "@/models/profile.model";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { CoverLetterEditorTab } from "./CoverLetterEditorTab";
import { CoverLetterAITab } from "./CoverLetterAITab";

interface CoverLetterFormSheetContentProps {
  isEditing: boolean;
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
  resumes: Resume[];
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  jobId: string;
  loading: boolean;
  onSave: () => void;
  onClose: () => void;
}

export function CoverLetterFormSheetContent({
  isEditing,
  coverLetterForm,
  setCoverLetterForm,
  templates,
  resumes,
  selectedResumeId,
  setSelectedResumeId,
  selectedTemplateId,
  setSelectedTemplateId,
  jobId,
  loading,
  onSave,
  onClose,
}: CoverLetterFormSheetContentProps) {
  return (
    <SheetContent className="overflow-y-auto sm:max-w-2xl">
      <SheetHeader>
        <SheetTitle>
          {isEditing ? "Edit Cover Letter" : "Create Cover Letter"}
        </SheetTitle>
      </SheetHeader>
      <div className="mt-6 space-y-4">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="ai">AI Generate</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="space-y-4">
            <CoverLetterEditorTab
              coverLetterForm={coverLetterForm}
              setCoverLetterForm={setCoverLetterForm}
              templates={templates}
            />
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <CoverLetterAITab
              selectedResumeId={selectedResumeId}
              setSelectedResumeId={setSelectedResumeId}
              selectedTemplateId={selectedTemplateId}
              setSelectedTemplateId={setSelectedTemplateId}
              resumes={resumes}
              templates={templates}
              coverLetterForm={coverLetterForm}
              setCoverLetterForm={setCoverLetterForm}
              jobId={jobId}
            />
          </TabsContent>
        </Tabs>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={onSave}
              disabled={loading || !coverLetterForm.title || !coverLetterForm.content}
              className="flex-1"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Cover Letter"
                : "Save Cover Letter"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          {!coverLetterForm.title && (
            <p className="text-xs text-muted-foreground">
              ⚠️ Title is required to save
            </p>
          )}
          {!coverLetterForm.content && (
            <p className="text-xs text-muted-foreground">
              ⚠️ Content is required to save
            </p>
          )}
        </div>
      </div>
    </SheetContent>
  );
}

