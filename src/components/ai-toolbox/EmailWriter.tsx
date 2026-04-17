"use client";

import { useState } from "react";
import { BaseAIToolLayout } from "./BaseAIToolLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Resume } from "@/models/profile.model";
import { toast } from "@/components/ui/use-toast";

interface EmailWriterProps {
  resumes: Resume[];
}

const emailTypes = [
  "Job Outreach",
  "Follow-up",
  "Thank You",
  "Networking",
  "Application Follow-up",
  "Reconnection",
];

export function EmailWriter({ resumes }: EmailWriterProps) {
  const [companyDetails, setCompanyDetails] = useState("");
  const [recipientDetails, setRecipientDetails] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [emailType, setEmailType] = useState("Job Outreach");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!targetJobTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Target Job Title is required",
      });
      return;
    }

    if (!selectedResumeId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a resume",
      });
      return;
    }

    setIsGenerating(true);
    setResult("");

    try {
      const response = await fetch("/api/ai/toolbox/email-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyDetails: companyDetails.trim(),
          recipientDetails: recipientDetails.trim(),
          targetJobTitle: targetJobTitle.trim(),
          emailType,
          resumeId: selectedResumeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate email");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += decoder.decode(value);
          setResult(fullResponse);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate email";
      if (process.env.NODE_ENV === "development") {
        console.error("Error generating email:", error);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <BaseAIToolLayout
      title="Email Writer"
      description="Generate professional, personalized emails for job applications and networking"
      resultContent={result}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      resumes={resumes}
      selectedResumeId={selectedResumeId}
      onResumeChange={setSelectedResumeId}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyDetails">Company Details or Job Description</Label>
          <Textarea
            id="companyDetails"
            placeholder="Enter information about the company, job description or any information we could use to personalize the email."
            value={companyDetails}
            onChange={(e) => setCompanyDetails(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientDetails">Recipient Details</Label>
          <Input
            id="recipientDetails"
            placeholder="Enter information about the receiver like name, role, etc."
            value={recipientDetails}
            onChange={(e) => setRecipientDetails(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetJobTitle">Target Job Title *</Label>
          <Input
            id="targetJobTitle"
            placeholder="Enter Job Title"
            value={targetJobTitle}
            onChange={(e) => setTargetJobTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailType">Email Type *</Label>
          <Select value={emailType} onValueChange={setEmailType}>
            <SelectTrigger id="emailType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {emailTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseAIToolLayout>
  );
}


