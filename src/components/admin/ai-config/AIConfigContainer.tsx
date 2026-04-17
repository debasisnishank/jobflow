"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Bot, Database, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIConfigList } from "./AIConfigList";
import { AIConfigEditor } from "./AIConfigEditor";

export interface AIConfig {
  id: string;
  featureKey: string;
  featureName: string;
  category: string;
  systemPrompt: string;
  mandatoryInstructions?: string | null;
  userPrompt?: string | null;
  outputFormat: "text" | "json" | "json-array" | "stream";
  jsonSchema?: string | null;
  requiresJsonFormat?: boolean;
  promptValidationRules?: string[];
  defaultModel: string;
  availableModels: string[];
  defaultTemperature: number;
  defaultMaxTokens: number;
  isActive: boolean;
  finalPrompt?: string;
}

export function AIConfigContainer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<AIConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<AIConfig | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/ai-configs");
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
        if (data.length === 0) {
          toast({
            title: "No AI Configs Found",
            description: "Click 'Seed Default Configs' to initialize AI configurations.",
            variant: "default",
          });
        }
      } else {
        throw new Error("Failed to fetch AI configs");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load AI configs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedConfigs = async () => {
    try {
      setSeeding(true);
      const response = await fetch("/api/admin/ai-configs/seed", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        const createdCount = result.created || 0;
        const updatedCount = result.updated || 0;
        const skippedCount = result.skipped || 0;
        
        let message = "";
        if (createdCount > 0) {
          message += `Created ${createdCount} config${createdCount !== 1 ? "s" : ""}. `;
        }
        if (updatedCount > 0) {
          message += `Updated ${updatedCount} config${updatedCount !== 1 ? "s" : ""}. `;
        }
        if (skippedCount > 0) {
          message += `${skippedCount} already up to date.`;
        }
        
        toast({
          title: "Success",
          description: message || "Models updated successfully",
          variant: "success",
        });
        await fetchConfigs();
      } else {
        throw new Error(result.error || "Failed to seed configs");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to seed AI configs",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleConfigUpdate = async (updatedConfig: AIConfig) => {
    try {
      const response = await fetch(`/api/admin/ai-configs/${updatedConfig.featureKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConfig),
      });

      if (response.ok) {
        const data = await response.json();
        setConfigs((prev) =>
          prev.map((c) => (c.featureKey === data.featureKey ? data : c))
        );
        setSelectedConfig(data);
        toast({
          title: "Success",
          description: "AI config updated successfully",
          variant: "success",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update config");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update AI config",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSelectConfig = (config: AIConfig) => {
    setSelectedConfig(config);
    setActiveTab("edit");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {configs.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Initialize AI Configurations
            </CardTitle>
            <CardDescription>
              No AI configurations found. Click below to seed default configurations for all AI features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSeedConfigs} disabled={seeding}>
              {seeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Seed Default Configs
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {configs.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                {configs.length} AI feature{configs.length !== 1 ? "s" : ""} configured
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSeedConfigs}
                disabled={seeding}
              >
                {seeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Update Models
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={fetchConfigs}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">All Configs</TabsTrigger>
              {selectedConfig && <TabsTrigger value="edit">Edit Config</TabsTrigger>}
            </TabsList>
            <TabsContent value="list">
              <AIConfigList
                configs={configs}
                onSelectConfig={handleSelectConfig}
              />
            </TabsContent>
            {selectedConfig && (
              <TabsContent value="edit">
                <AIConfigEditor
                  config={selectedConfig}
                  onUpdate={handleConfigUpdate}
                  onCancel={() => {
                    setSelectedConfig(null);
                    setActiveTab("list");
                  }}
                />
              </TabsContent>
            )}
          </Tabs>
        </>
      )}
    </div>
  );
}
