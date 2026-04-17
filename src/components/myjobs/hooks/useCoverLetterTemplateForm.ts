"use strict";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { createCoverLetterTemplate } from "@/actions/coverLetter.actions";

export function useCoverLetterTemplateForm(onTemplateCreated: () => void) {
  const [templateForm, setTemplateForm] = useState({
    title: "",
    content: "",
    isDefault: false,
  });

  const handleCreateTemplate = async (
    setIsTemplateDialogOpen: (open: boolean) => void
  ) => {
    if (!templateForm.title || !templateForm.content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    try {
      await createCoverLetterTemplate(templateForm);
      toast({
        title: "Success",
        description: "Template created successfully",
      });
      setTemplateForm({ title: "", content: "", isDefault: false });
      setIsTemplateDialogOpen(false);
      onTemplateCreated();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create template";

      if (
        errorMessage.includes("does not exist") ||
        errorMessage.includes("run: npx prisma")
      ) {
        toast({
          variant: "destructive",
          title: "Database Setup Required",
          description:
            "Please run: npx prisma generate && npx prisma db push to create the template tables.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    }
  };

  const handleUseExample = () => {
    setTemplateForm({
      title: "Professional Cover Letter Template",
      content: `Dear Hiring Manager,

I am excited to apply for the [JOB_TITLE] position at [COMPANY_NAME]. 
With my experience in [RELEVANT_FIELD], I am confident that my skills 
align perfectly with your requirements.

In my previous role, I successfully [KEY_ACHIEVEMENT]. This experience 
has prepared me to [CONTRIBUTION_TO_NEW_ROLE].

What particularly excites me about [COMPANY_NAME] is [SPECIFIC_REASON]. 
I am eager to bring my expertise in [KEY_SKILL] to your team.

Thank you for considering my application. I look forward to the 
opportunity to discuss how I can contribute to [COMPANY_NAME]'s success.

Best regards,
[YOUR_NAME]`,
      isDefault: false,
    });
  };

  return {
    templateForm,
    setTemplateForm,
    handleCreateTemplate,
    handleUseExample,
  };
}

















