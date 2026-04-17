"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FileText } from "lucide-react";
import { CoverLetterTemplate } from "@/models/coverLetter.model";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CoverLetterTemplateListTab } from "./CoverLetterTemplateListTab";
import { CoverLetterTemplateCreateTab } from "./CoverLetterTemplateCreateTab";
import { CoverLetterTemplateHelpTab } from "./CoverLetterTemplateHelpTab";
import { useCoverLetterTemplateForm } from "./hooks/useCoverLetterTemplateForm";

interface CoverLetterTemplateDialogProps {
  isTemplateDialogOpen: boolean;
  setIsTemplateDialogOpen: (open: boolean) => void;
  templates: CoverLetterTemplate[];
  onTemplateCreated: () => void;
}

export function CoverLetterTemplateDialog({
  isTemplateDialogOpen,
  setIsTemplateDialogOpen,
  templates,
  onTemplateCreated,
}: CoverLetterTemplateDialogProps) {
  const {
    templateForm,
    setTemplateForm,
    handleCreateTemplate,
    handleUseExample,
  } = useCoverLetterTemplateForm(onTemplateCreated);

  const switchToCreateTab = () => {
    const createTab = document.querySelector('[value="create"]') as HTMLElement;
    createTab?.click();
  };

  const handleUseExampleAndSwitch = () => {
    handleUseExample();
    switchToCreateTab();
  };

  return (
    <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Manage Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cover Letter Templates
          </DialogTitle>
          <DialogDescription>
            Create reusable templates for your cover letters. Templates help AI
            generate personalized cover letters faster by providing structure
            and style guidelines.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">My Templates</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="help">Help & Examples</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-3">
            <CoverLetterTemplateListTab
              templates={templates}
              onCreateClick={switchToCreateTab}
            />
          </TabsContent>
          <TabsContent value="create" className="space-y-4">
            <CoverLetterTemplateCreateTab
              templateForm={templateForm}
              setTemplateForm={setTemplateForm}
              onUseExample={handleUseExampleAndSwitch}
              onCreateClick={switchToCreateTab}
            />
          </TabsContent>
          <TabsContent value="help" className="space-y-4">
            <CoverLetterTemplateHelpTab onUseExample={handleUseExampleAndSwitch} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsTemplateDialogOpen(false);
              setTemplateForm({ title: "", content: "", isDefault: false });
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => handleCreateTemplate(setIsTemplateDialogOpen)}
            disabled={!templateForm.title || !templateForm.content}
          >
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

