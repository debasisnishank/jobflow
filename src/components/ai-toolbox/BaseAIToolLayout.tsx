"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles, History, Upload, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Resume } from "@/models/profile.model";
import { toast } from "@/components/ui/use-toast";

interface BaseAIToolLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  resultContent: string;
  isGenerating: boolean;
  onGenerate: () => void;
  resumes: Resume[];
  selectedResumeId: string;
  onResumeChange: (resumeId: string) => void;
  showHistory?: boolean;
  onViewHistory?: () => void;
}

export function BaseAIToolLayout({
  title,
  description,
  children,
  resultContent,
  isGenerating,
  onGenerate,
  resumes,
  selectedResumeId,
  onResumeChange,
  showHistory = true,
  onViewHistory,
}: BaseAIToolLayoutProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!resultContent) return;

    try {
      await navigator.clipboard.writeText(resultContent);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Left Panel - Input Form */}
      <Card className="h-fit">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
            {showHistory && onViewHistory && (
              <Button variant="outline" size="sm" onClick={onViewHistory}>
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mb-6">{description}</p>
          )}

          <div className="space-y-6">
            {children}

            {/* Resume Upload Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Your Profile *</Label>
              <RadioGroup
                value="resume"
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="resume" id="resume" />
                  <Label htmlFor="resume" className="font-normal cursor-pointer">
                    Select Resume
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="linkedin" id="linkedin" disabled />
                  <Label htmlFor="linkedin" className="font-normal text-muted-foreground cursor-not-allowed">
                    Use LinkedIn Profile (Coming Soon)
                  </Label>
                </div>
              </RadioGroup>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium mb-1">Add your Resume</p>
                <p className="text-xs text-muted-foreground mb-4">
                  File names cannot contain spaces or underscores and should be in either .doc, .docx, or .pdf.
                </p>
                <select
                  value={selectedResumeId}
                  onChange={(e) => onResumeChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">Select a resume</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !selectedResumeId}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right Panel - Result */}
      <Card className="h-fit">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-semibold">Result</h2>
            </div>
            {resultContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="min-h-[300px] sm:min-h-[400px] border-2 border-dashed border-gray-200 rounded-lg p-4 sm:p-6">
            {resultContent ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {resultContent}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Your AI generated content will show here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

