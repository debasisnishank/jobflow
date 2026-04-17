"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

interface WorkExperience {
  id?: string;
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

interface WorkExperienceFormProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

export function WorkExperienceForm({ data, onChange }: WorkExperienceFormProps) {
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);

  const addExperience = () => {
    onChange([
      ...data,
      {
        company: "",
        jobTitle: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false,
      },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    if (field === "current" && value === true) {
      newData[index].endDate = "";
    }
    onChange(newData);
  };

  const generateBulletPoints = async (index: number) => {
    const experience = data[index];
    
    if (!experience.jobTitle || !experience.company) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in job title and company first.",
      });
      return;
    }

    setGeneratingFor(index);
    try {
      const response = await fetch("/api/ai/resume/generate-bullets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: experience.jobTitle,
          company: experience.company,
          existingDescription: experience.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate bullet points");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedBullets = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: !done });
        accumulatedBullets += chunk;
        updateExperience(index, "description", accumulatedBullets);
      }
      
      toast({
        title: "Bullet Points Generated!",
        description: "AI has created professional bullet points for this experience.",
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate bullet points. Please try again.",
      });
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Work Experience</h3>
          <p className="text-sm text-gray-600">
            Add your professional work history, starting with the most recent position.
          </p>
        </div>
        <Button
          onClick={addExperience}
          size="sm"
          variant="outline"
          className="border-[#3B82F6]/30 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <div className="grid grid-cols-2 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-gray-400" />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">No work experience added yet</p>
          <Button onClick={addExperience} size="sm" variant="outline" className="border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Experience
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {data.map((experience, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Experience #{index + 1}
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => generateBulletPoints(index)}
                    disabled={generatingFor === index}
                    size="sm"
                    variant="outline"
                    className="border-[#3B82F6]/30 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]"
                  >
                    {generatingFor === index ? (
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
                  <Button
                    onClick={() => removeExperience(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={experience.jobTitle}
                    onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                    placeholder="Senior Software Engineer"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={experience.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    placeholder="Tech Company Inc."
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Input
                  value={experience.location}
                  onChange={(e) => updateExperience(index, "location", e.target.value)}
                  placeholder="San Francisco, CA"
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date</Label>
                  <Input
                    type="month"
                    value={experience.endDate || ""}
                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                    disabled={experience.current}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${index}`}
                  checked={experience.current}
                  onCheckedChange={(checked: boolean) => updateExperience(index, "current", checked)}
                />
                <Label htmlFor={`current-${index}`} className="text-sm cursor-pointer">
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Description & Achievements</Label>
                <Textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Focus on quantifiable results when possible"
                  rows={6}
                  className="bg-white border-gray-300 font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Use bullet points (•) or dashes (-) to list your responsibilities and achievements
                </p>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}

