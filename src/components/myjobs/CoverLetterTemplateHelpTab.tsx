"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";

interface CoverLetterTemplateHelpTabProps {
  onUseExample: () => void;
}

export function CoverLetterTemplateHelpTab({
  onUseExample,
}: CoverLetterTemplateHelpTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            What are Templates?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Templates are reusable structures that guide AI when generating your
            cover letters. Instead of starting from scratch each time, you
            provide a framework that matches your writing style.
          </p>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Benefits:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <li>Consistent style across all your cover letters</li>
              <li>
                Faster generation - AI follows your preferred structure
              </li>
              <li>
                Less editing needed - letters match your style from the start
              </li>
              <li>
                Multiple templates for different job types or industries
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Example Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg font-mono text-xs whitespace-pre-wrap">
            {`Dear Hiring Manager,

I am excited to apply for the [JOB_TITLE] position at [COMPANY_NAME]. 
With [X] years of experience in [RELEVANT_FIELD], I am confident that 
my skills align perfectly with your requirements.

In my previous role at [PREVIOUS_COMPANY], I successfully [KEY_ACHIEVEMENT]. 
This experience has prepared me to [CONTRIBUTION_TO_NEW_ROLE].

What particularly excites me about [COMPANY_NAME] is [SPECIFIC_REASON]. 
I am eager to bring my expertise in [KEY_SKILL] to your team.

Thank you for considering my application. I look forward to the 
opportunity to discuss how I can contribute to [COMPANY_NAME]'s success.

Best regards,
[YOUR_NAME]`}
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={onUseExample}>
            <Copy className="h-4 w-4 mr-2" />
            Use This Example
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to Use Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                Create a template
              </span>{" "}
              with your preferred cover letter structure
            </li>
            <li>
              <span className="font-medium text-foreground">
                Use placeholders
              </span>{" "}
              like [COMPANY_NAME] and [JOB_TITLE] for dynamic content
            </li>
            <li>
              <span className="font-medium text-foreground">
                Select the template
              </span>{" "}
              when generating a new cover letter (or set one as default)
            </li>
            <li>
              <span className="font-medium text-foreground">AI generates</span>{" "}
              a personalized letter following your template structure
            </li>
            <li>
              <span className="font-medium text-foreground">
                Review and edit
              </span>{" "}
              the generated letter before saving
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

















