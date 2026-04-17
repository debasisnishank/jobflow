"use client";

import { useState } from "react";
import { BaseAIToolLayout } from "./BaseAIToolLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Resume } from "@/models/profile.model";
import { toast } from "@/components/ui/use-toast";

interface LinkedInPostProps {
  resumes: Resume[];
}

const tones = ["Professional", "Casual", "Enthusiastic", "Informational", "Custom"];
const lengths = ["Short", "Medium", "Long"];
const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
];

export function LinkedInPost({ resumes }: LinkedInPostProps) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [useEmojis, setUseEmojis] = useState(false);
  const [useBulletPoints, setUseBulletPoints] = useState(false);
  const [useHashtags, setUseHashtags] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [language, setLanguage] = useState("English");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Topic is required",
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
      const response = await fetch("/api/ai/toolbox/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          description: description.trim(),
          useEmojis,
          useBulletPoints,
          useHashtags,
          tone,
          length,
          language,
          resumeId: selectedResumeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate LinkedIn post");
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
      const errorMessage = error instanceof Error ? error.message : "Failed to generate LinkedIn post";
      if (process.env.NODE_ENV === "development") {
        console.error("Error generating LinkedIn post:", error);
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
      title="AI Post Generator"
      description="Create engaging LinkedIn posts that showcase your expertise and insights"
      resultContent={result}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      resumes={resumes}
      selectedResumeId={selectedResumeId}
      onResumeChange={setSelectedResumeId}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic *</Label>
          <Input
            id="topic"
            placeholder="Enter Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4 border-t pt-4">
          <Label className="text-base font-semibold">Advanced Settings</Label>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useEmojis"
                checked={useEmojis}
                onCheckedChange={(checked) => setUseEmojis(checked === true)}
              />
              <Label htmlFor="useEmojis" className="font-normal cursor-pointer">
                Use Emojis
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useBulletPoints"
                checked={useBulletPoints}
                onCheckedChange={(checked) => setUseBulletPoints(checked === true)}
              />
              <Label htmlFor="useBulletPoints" className="font-normal cursor-pointer">
                Use Bullet Points
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useHashtags"
                checked={useHashtags}
                onCheckedChange={(checked) => setUseHashtags(checked === true)}
              />
              <Label htmlFor="useHashtags" className="font-normal cursor-pointer">
                Use Hashtags
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <RadioGroup value={tone} onValueChange={setTone}>
              <div className="flex flex-wrap gap-4">
                {tones.map((t) => (
                  <div key={t} className="flex items-center space-x-2">
                    <RadioGroupItem value={t} id={`tone-${t}`} />
                    <Label htmlFor={`tone-${t}`} className="font-normal cursor-pointer">
                      {t}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <RadioGroup value={length} onValueChange={setLength}>
              <div className="flex gap-4">
                {lengths.map((l) => (
                  <div key={l} className="flex items-center space-x-2">
                    <RadioGroupItem value={l} id={`length-${l}`} />
                    <Label htmlFor={`length-${l}`} className="font-normal cursor-pointer">
                      {l}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </BaseAIToolLayout>
  );
}


