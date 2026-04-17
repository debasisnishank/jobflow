"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SummaryFormProps {
  data: string;
  onChange: (data: string) => void;
  resumeId?: string;
}

export function SummaryForm({ data, onChange, resumeId }: SummaryFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!resumeId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please save the resume first before generating a summary.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/resume/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate summary";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedSummary = "";

      try {
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            accumulatedSummary += chunk;
            onChange(accumulatedSummary);
          }
        }
      } finally {
        reader.releaseLock();
      }
      
      toast({
        title: "Summary Generated!",
        description: "AI has created a professional summary for you.",
        variant: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate summary. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Professional Summary</h3>
          <p className="text-sm text-gray-600">
            A brief overview of your professional background, skills, and career goals.
          </p>
        </div>
        <Button
          onClick={handleAIGenerate}
          disabled={isGenerating}
          size="sm"
          className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white shrink-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary" className="text-sm font-medium">
          Summary
        </Label>
        <Textarea
          id="summary"
          value={data}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a compelling professional summary that highlights your experience, skills, and what makes you unique..."
          rows={6}
          className="bg-white border-gray-300 focus:border-[#3B82F6]"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Aim for 2-4 sentences that capture your professional essence</span>
          <span>{data.length} characters</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for a Great Summary:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Start with your current role or expertise level</li>
          <li>Highlight 2-3 key skills or accomplishments</li>
          <li>Mention years of experience if relevant</li>
          <li>End with your career goal or what you bring to employers</li>
        </ul>
      </div>
    </div>
  );
}

