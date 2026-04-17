"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";

interface CustomSection {
  id?: string;
  sectionId?: string;
  title: string;
  content: string;
}

interface CustomSectionFormProps {
  data: CustomSection[];
  onChange: (sections: CustomSection[]) => void;
}

export function CustomSectionForm({ data, onChange }: CustomSectionFormProps) {
  const sections = data || [];

  const handleAdd = () => {
    const newSection: CustomSection = {
      title: "",
      content: "",
    };
    onChange([...sections, newSection]);
  };

  const handleRemove = (index: number) => {
    const updated = sections.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleChange = (index: number, field: keyof CustomSection, value: string) => {
    const updated = sections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    );
    onChange(updated);
  };

  if (sections.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 mb-4">No custom sections added yet</p>
          <Button
            type="button"
            variant="outline"
            onClick={handleAdd}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Section
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-lg bg-white space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Section {index + 1}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <Input
              value={section.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              placeholder="e.g., Projects, Awards, Publications"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <Textarea
              value={section.content}
              onChange={(e) => handleChange(index, "content", e.target.value)}
              placeholder="Enter section content here..."
              rows={6}
              className="w-full resize-none"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed border-gray-300 hover:border-gray-400"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Section
      </Button>
    </div>
  );
}

