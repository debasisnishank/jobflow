"use client";

import { useState } from "react";
import { BaseAIToolLayout } from "./BaseAIToolLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Resume } from "@/models/profile.model";
import { toast } from "@/components/ui/use-toast";

interface ElevatorPitchProps {
  resumes: Resume[];
}

export function ElevatorPitch({ resumes }: ElevatorPitchProps) {
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
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
      const response = await fetch("/api/ai/toolbox/elevator-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetJobTitle: targetJobTitle.trim(),
          purpose: purpose.trim(),
          focusArea: focusArea.trim(),
          targetAudience: targetAudience.trim(),
          resumeId: selectedResumeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate elevator pitch");
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
      const errorMessage = error instanceof Error ? error.message : "Failed to generate elevator pitch";
      if (process.env.NODE_ENV === "development") {
        console.error("Error generating elevator pitch:", error);
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
      title="AI Elevator Pitch"
      description="Create a compelling 30-second elevator pitch that captures attention"
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
            placeholder="What role are you targeting?"
            value={targetJobTitle}
            onChange={(e) => setTargetJobTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Input
            id="purpose"
            placeholder="Why are you pitching?"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="focusArea">Focus Area</Label>
          <Input
            id="focusArea"
            placeholder="What do you want the pitch to focus on?"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input
            id="targetAudience"
            placeholder="Who is going to receive your pitch?"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>
      </div>
    </BaseAIToolLayout>
  );
}


