"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SliderWithInput } from "./ui/SliderWithInput";
import { ColorPicker } from "./ui/ColorPicker";
import { SegmentedControl } from "./ui/SegmentedControl";

export interface StyleSettings {
  paperSize: string;
  font: string;
  fontSize: number;
  lineHeight: number;
  sectionGap: number;
  leftRightMargins: number;
  topBottomMargins: number;
  accentColor: string;
  nameFormat: "capitalize" | "uppercase" | "lowercase";
  headerDelimiter: string;
  groupWorkPreferences?: boolean;
  workExperienceGroupBy?: "organization" | "position";
}

interface StyleSettingsProps {
  settings: StyleSettings;
  onChange: (settings: Partial<StyleSettings>) => void;
  onReset: () => void;
}

export const DEFAULT_SETTINGS: StyleSettings = {
  paperSize: "a4",
  font: "Times New Roman",
  fontSize: 11,
  lineHeight: 1.125,
  sectionGap: 0.08,
  leftRightMargins: 0.2,
  topBottomMargins: 0.25,
  accentColor: "#000000",
  nameFormat: "capitalize",
  headerDelimiter: "|",
  groupWorkPreferences: false,
  workExperienceGroupBy: "position",
};

const PAPER_SIZES = [
  { value: "a4", label: "A4 (8.27x11.69 Inches)" },
  { value: "letter", label: "Letter (8.5x11 Inches)" },
  { value: "legal", label: "Legal (8.5x14 Inches)" },
];

const FONTS = [
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Arial", label: "Arial" },
  { value: "Calibri", label: "Calibri" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Helvetica", label: "Helvetica" },
];

const HEADER_DELIMITERS = [
  { value: "|", label: "|" },
  { value: "•", label: "•" },
  { value: "-", label: "-" },
  { value: "◊", label: "◊" },
  { value: "*", label: "*" },
];


export function StyleSettings({ settings, onChange, onReset }: StyleSettingsProps) {
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [workExpOpen, setWorkExpOpen] = useState(true);

  const handleChange = (key: keyof StyleSettings, value: any) => {
    onChange({ [key]: value });
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS);

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Style Settings</h2>
          <button
            type="button"
            onClick={() => setPersonalInfoOpen(!personalInfoOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {personalInfoOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paper-size">Paper Size</Label>
            <Select
              value={settings.paperSize}
              onValueChange={(value) => handleChange("paperSize", value)}
            >
              <SelectTrigger id="paper-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAPER_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font">Font</Label>
            <Select
              value={settings.font}
              onValueChange={(value) => handleChange("font", value)}
            >
              <SelectTrigger id="font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SliderWithInput
            label="Font Size"
            value={settings.fontSize}
            min={8}
            max={18}
            step={0.5}
            unit="pt"
            formatValue={(v) => `${v} pt`}
            onChange={(value) => handleChange("fontSize", value)}
          />

          <SliderWithInput
            label="Line Height"
            value={settings.lineHeight}
            min={1}
            max={2}
            step={0.125}
            formatValue={(v) => v.toFixed(3)}
            onChange={(value) => handleChange("lineHeight", value)}
          />

          <SliderWithInput
            label="Section Gap"
            value={settings.sectionGap}
            min={0}
            max={0.5}
            step={0.01}
            unit="in"
            formatValue={(v) => `${v.toFixed(2)} in`}
            onChange={(value) => handleChange("sectionGap", value)}
          />

          <SliderWithInput
            label="Left & Right Margins"
            value={settings.leftRightMargins}
            min={0}
            max={2}
            step={0.01}
            unit="in"
            formatValue={(v) => `${v.toFixed(2)} in`}
            onChange={(value) => handleChange("leftRightMargins", value)}
          />

          <SliderWithInput
            label="Top & Bottom Margins"
            value={settings.topBottomMargins}
            min={0}
            max={2}
            step={0.01}
            unit="in"
            formatValue={(v) => `${v.toFixed(2)} in`}
            onChange={(value) => handleChange("topBottomMargins", value)}
          />

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <ColorPicker
              value={settings.accentColor}
              onChange={(color) => handleChange("accentColor", color)}
            />
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <SegmentedControl
              value={settings.nameFormat}
              options={[
                { value: "capitalize", label: "Capitalize" },
                { value: "uppercase", label: "Uppercase" },
                { value: "lowercase", label: "Lowercase" },
              ]}
              onChange={(value) => handleChange("nameFormat", value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Header Delimiter</Label>
            <SegmentedControl
              value={settings.headerDelimiter}
              options={HEADER_DELIMITERS.map((d) => ({ value: d.value, label: d.label }))}
              onChange={(value) => handleChange("headerDelimiter", value)}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasChanges}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to default
          </Button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setPersonalInfoOpen(!personalInfoOpen)}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-900"
          >
            <span>Personal Information</span>
            {personalInfoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {personalInfoOpen && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="group-work-prefs">Group Work Preferences</Label>
                <input
                  id="group-work-prefs"
                  type="checkbox"
                  checked={settings.groupWorkPreferences || false}
                  onChange={(e) => handleChange("groupWorkPreferences", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setWorkExpOpen(!workExpOpen)}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-900"
          >
            <span>Work Experience</span>
            {workExpOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {workExpOpen && (
            <div className="mt-4 space-y-4">
              <Label>Show Work Experience By</Label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleChange("workExperienceGroupBy", "organization")}
                  className={`w-full p-3 text-left border-2 rounded-lg transition-all ${settings.workExperienceGroupBy === "organization"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="font-medium text-sm mb-1">Group By Organization</div>
                  <div className="text-xs text-gray-500">
                    Organizations grouped together with positions listed under each
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("workExperienceGroupBy", "position")}
                  className={`w-full p-3 text-left border-2 rounded-lg transition-all ${settings.workExperienceGroupBy === "position"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="font-medium text-sm mb-1">Group By Position</div>
                  <div className="text-xs text-gray-500">
                    Positions listed chronologically with organization shown for each
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

