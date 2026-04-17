"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, X, Lock, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AIConfig } from "./AIConfigContainer";

interface AIConfigEditorProps {
  config: AIConfig;
  onUpdate: (config: AIConfig) => Promise<void>;
  onCancel: () => void;
}

export function AIConfigEditor({ config, onUpdate, onCancel }: AIConfigEditorProps) {
  const [formData, setFormData] = useState<Partial<AIConfig>>({
    featureName: config.featureName,
    systemPrompt: config.systemPrompt,
    userPrompt: config.userPrompt || "",
    defaultModel: config.defaultModel,
    defaultTemperature: config.defaultTemperature,
    defaultMaxTokens: config.defaultMaxTokens,
    isActive: config.isActive,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onUpdate({
        ...config,
        ...formData,
      } as AIConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update config");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{config.featureName}</CardTitle>
              <CardDescription className="font-mono text-xs mt-1">
                {config.featureKey}
              </CardDescription>
            </div>
            <Badge variant={config.isActive ? "default" : "secondary"}>
              {config.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Read-only fields */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Mandatory Instructions (Read-only)
            </Label>
            <Textarea
              value={config.mandatoryInstructions || "No mandatory instructions"}
              readOnly
              className="bg-muted font-mono text-sm"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              These instructions are automatically appended to ensure required formats (like JSON) are always enforced.
            </p>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={formData.systemPrompt || ""}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              rows={8}
              className="font-mono text-sm"
              placeholder="Enter the system prompt..."
            />
            <p className="text-xs text-muted-foreground">
              This is the main editable prompt. It will be sanitized and validated before use.
            </p>
          </div>

          {/* User Prompt (optional) */}
          <div className="space-y-2">
            <Label htmlFor="userPrompt">User Prompt Template (Optional)</Label>
            <Textarea
              id="userPrompt"
              value={formData.userPrompt || ""}
              onChange={(e) => setFormData({ ...formData, userPrompt: e.target.value })}
              rows={4}
              className="font-mono text-sm"
              placeholder="Optional user prompt template with variables..."
            />
          </div>

          {/* Model Configuration */}
          <div className="space-y-2">
            <Label htmlFor="defaultModel">Default Model</Label>
            <Select
              value={formData.defaultModel}
              onValueChange={(value) => setFormData({ ...formData, defaultModel: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.availableModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temperature and Max Tokens */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={formData.defaultTemperature}
                onChange={(e) =>
                  setFormData({ ...formData, defaultTemperature: parseFloat(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                min="1"
                value={formData.defaultMaxTokens}
                onChange={(e) =>
                  setFormData({ ...formData, defaultMaxTokens: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this AI configuration
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
