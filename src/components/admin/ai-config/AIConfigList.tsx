"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Code2, MessageSquare, Bot } from "lucide-react";
import { AIConfig } from "./AIConfigContainer";

interface AIConfigListProps {
  configs: AIConfig[];
  onSelectConfig: (config: AIConfig) => void;
}

const categoryColors = {
  toolbox: "bg-blue-100 text-blue-800",
  resume: "bg-green-100 text-green-800",
  "mock-interview": "bg-purple-100 text-purple-800",
  other: "bg-gray-100 text-gray-800",
};

const outputFormatIcons = {
  text: MessageSquare,
  json: Code2,
  "json-array": Code2,
  stream: Bot,
};

export function AIConfigList({ configs, onSelectConfig }: AIConfigListProps) {
  const groupedConfigs = configs.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, AIConfig[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3 capitalize">{category.replace("-", " ")}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryConfigs.map((config) => {
              const FormatIcon = outputFormatIcons[config.outputFormat] || MessageSquare;
              return (
                <Card key={config.featureKey} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{config.featureName}</CardTitle>
                        <CardDescription className="mt-1 text-xs font-mono">
                          {config.featureKey}
                        </CardDescription>
                      </div>
                      <Badge className={categoryColors[config.category as keyof typeof categoryColors] || categoryColors.other}>
                        {category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FormatIcon className="h-4 w-4" />
                      <span className="capitalize">{config.outputFormat}</span>
                      <span className="mx-1">•</span>
                      <span>{config.defaultModel}</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Temperature: {config.defaultTemperature}</div>
                      <div>Max Tokens: {config.defaultMaxTokens}</div>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {config.systemPrompt.substring(0, 100)}...
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onSelectConfig(config)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Config
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
