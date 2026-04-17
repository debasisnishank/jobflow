"use client";

import { useState } from "react";
import { Palette, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TemplateSelectorProps {
  currentTemplate: string;
  currentColor: string;
  onTemplateChange: (template: string) => void;
  onColorChange: (color: string) => void;
}

const TEMPLATES = [
  { value: "modern", label: "Modern", description: "Clean two-column layout" },
  { value: "professional", label: "Professional", description: "Traditional single-column" },
  { value: "minimal", label: "Minimal", description: "Ultra-clean design" },
  { value: "creative", label: "Creative", description: "Unique and bold" },
  { value: "classic", label: "Classic", description: "Time-tested format" },
];

const COLORS = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Orange" },
  { value: "#EF4444", label: "Red" },
  { value: "#EC4899", label: "Pink" },
  { value: "#6366F1", label: "Indigo" },
  { value: "#14B8A6", label: "Teal" },
];

export function TemplateSelector({
  currentTemplate,
  currentColor,
  onTemplateChange,
  onColorChange,
}: TemplateSelectorProps) {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
            <Layout className="h-4 w-4 md:mr-2" />
            <span className="hidden sm:inline">Template</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[280px]">
          <DropdownMenuLabel>Choose Template</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {TEMPLATES.map((template) => (
            <DropdownMenuItem
              key={template.value}
              onClick={() => onTemplateChange(template.value)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="font-medium">{template.label}</div>
                <div className="text-xs text-gray-500">{template.description}</div>
              </div>
              {currentTemplate === template.value && (
                <Badge className="bg-[#3B82F6] text-white text-xs">Active</Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        {/* <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
            <div
              className="h-4 w-4 rounded-full border-2 border-white shadow-sm md:mr-2"
              style={{ backgroundColor: currentColor }}
            />
            <span className="hidden sm:inline">Color</span>
          </Button>
        </DropdownMenuTrigger> */}
        {/* <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Choose Color</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-4 gap-2 p-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorChange(color.value)}
                className="group relative h-10 w-10 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all hover:scale-110"
                style={{ backgroundColor: color.value }}
                title={color.label}
              >
                {currentColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-white shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </DropdownMenuContent> */}
      </DropdownMenu>
    </div>
  );
}

