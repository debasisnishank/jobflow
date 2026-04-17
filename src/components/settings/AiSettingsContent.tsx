"use client";

import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AiModel, OpenaiModel } from "@/models/ai.model";

interface AiSettingsContentProps {
  selectedModel: AiModel;
  setSelectedProviderModel: (model: string) => void;
  onSave: () => void;
}

export function AiSettingsContent({
  selectedModel,
  setSelectedProviderModel,
  onSave,
}: AiSettingsContentProps) {
  const getModelsList = () => {
    return Object.entries(OpenaiModel);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="ai-model" className="text-sm font-medium">
          OpenAI Model
        </Label>
        <Select value={selectedModel.model} onValueChange={setSelectedProviderModel}>
          <SelectTrigger
            id="ai-model"
            aria-label="Select OpenAI Model"
            className="w-full sm:w-[280px] border-border/60"
          >
            <SelectValue placeholder="Select OpenAI Model" />
          </SelectTrigger>
          <SelectContent className="border-border/50">
            <SelectGroup>
              {getModelsList().map(([key, value]) => (
                <SelectItem key={key} value={value} className="capitalize">
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          All AI features use OpenAI. Make sure your OPENAI_API_KEY is set in
          environment variables.
        </p>
      </div>
      <div className="pt-4">
        <Button
          className="min-w-[120px] bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white hover:from-[#2563EB] hover:to-[#1E3A8A] shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={onSave}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}

















