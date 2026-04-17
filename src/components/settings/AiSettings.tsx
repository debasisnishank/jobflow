"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AiModel, AiProvider, defaultModel } from "@/models/ai.model";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/utils/localstorage.utils";
import { toast } from "../ui/use-toast";
import { AiSettingsContent } from "./AiSettingsContent";

function AiSettings() {
  const [selectedModel, setSelectedModel] = useState<AiModel>(defaultModel);
  const setSelectedProviderModel = (model: string) => {
    setSelectedModel({ provider: AiProvider.OPENAI, model });
  };

  useEffect(() => {
    const savedSettings = getFromLocalStorage("aiSettings", selectedModel);
    setSelectedModel(savedSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveModelSettings = () => {
    if (!selectedModel.model) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a model to save.",
      });
      return;
    }
    saveToLocalStorage("aiSettings", selectedModel);
    toast({
      variant: "success",
      title: "Saved!",
      description: "AI Settings saved successfully.",
    });
  };

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            AI Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure AI service provider and model preferences
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <AiSettingsContent
          selectedModel={selectedModel}
          setSelectedProviderModel={setSelectedProviderModel}
          onSave={saveModelSettings}
        />
      </CardContent>
    </Card>
  );
}

export default AiSettings;
