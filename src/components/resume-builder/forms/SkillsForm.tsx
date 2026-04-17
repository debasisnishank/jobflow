"use client";

import { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Skill {
  id?: string;
  name: string;
  level?: string;
  category?: string;
}

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const SKILL_CATEGORIES = [
  "Programming Languages",
  "Frameworks & Libraries",
  "Tools & Technologies",
  "Soft Skills",
  "Languages",
  "Other",
];

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<string>("");
  const [newSkillCategory, setNewSkillCategory] = useState<string>("");

  const addSkill = () => {
    if (!newSkillName.trim()) return;

    onChange([
      ...data,
      {
        name: newSkillName.trim(),
        level: newSkillLevel || undefined,
        category: newSkillCategory || undefined,
      },
    ]);
    setNewSkillName("");
    setNewSkillLevel("");
    setNewSkillCategory("");
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const groupedSkills = data.reduce((acc, skill) => {
    const category = skill.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Skills</h3>
        <p className="text-sm text-gray-600">
          Add your technical and professional skills. Group them by category for better organization.
        </p>
      </div>

      <Card className="border-gray-200 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-medium">Skill Name</Label>
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., React, Python, Communication"
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Level (Optional)</Label>
                <Select value={newSkillLevel} onValueChange={setNewSkillLevel}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Category (Optional)</Label>
                <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={addSkill}
              disabled={!newSkillName.trim()}
              size="sm"
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      {data.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-2">No skills added yet</p>
            <p className="text-xs text-gray-500">Add your skills using the form above</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <div className="h-1 w-8 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8]" />
                {category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => {
                  const actualIndex = data.indexOf(skill);
                  return (
                    <Badge
                      key={actualIndex}
                      variant="secondary"
                      className="pl-3 pr-1 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 group"
                    >
                      <span className="mr-2">
                        {skill.name}
                        {skill.level && (
                          <span className="text-xs text-gray-500 ml-1">({skill.level})</span>
                        )}
                      </span>
                      <button
                        onClick={() => removeSkill(actualIndex)}
                        className="h-5 w-5 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <X className="h-3 w-3 text-gray-400 group-hover:text-red-600" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for Skills Section:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Include both technical and soft skills</li>
          <li>Be specific (e.g., "React.js" instead of just "JavaScript")</li>
          <li>Group similar skills together using categories</li>
          <li>Only include skills you can confidently discuss in an interview</li>
        </ul>
      </div>
    </div>
  );
}

