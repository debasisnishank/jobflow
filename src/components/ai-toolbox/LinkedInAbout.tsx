"use client";

import { useState } from "react";
import { BaseAIToolLayout } from "./BaseAIToolLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Resume } from "@/models/profile.model";
import { toast } from "@/components/ui/use-toast";

interface LinkedInAboutProps {
  resumes: Resume[];
}

export function LinkedInAbout({ resumes }: LinkedInAboutProps) {
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
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
      const response = await fetch("/api/ai/toolbox/linkedin-about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetJobTitle: targetJobTitle.trim(),
          keywords: keywords.split(",").map(k => k.trim()).filter(k => k),
          resumeId: selectedResumeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate LinkedIn About section");
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
      const errorMessage = error instanceof Error ? error.message : "Failed to generate LinkedIn About";
      if (process.env.NODE_ENV === "development") {
        console.error("Error generating LinkedIn About:", error);
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
      title="AI About Generator"
      description="Create a compelling LinkedIn About section that tells your professional story"
      resultContent={result}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      resumes={resumes}
      selectedResumeId={selectedResumeId}
      onResumeChange={setSelectedResumeId}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetJobTitle">Target Job Title</Label>
          <Input
            id="targetJobTitle"
            placeholder="Enter Job Title"
            value={targetJobTitle}
            onChange={(e) => setTargetJobTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords To Include</Label>
          <Input
            id="keywords"
            placeholder="Press enter after each word"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Separate keywords with commas
          </p>
        </div>
      </div>
    </BaseAIToolLayout>
  );
}


