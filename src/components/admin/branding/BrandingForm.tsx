"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { LogoUpload } from "@/components/admin/branding/LogoUpload";

export function BrandingForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    appName: "",
    brandName: "",
    description: "",
    logoPath: "",
    supportEmail: "",
    faviconPath: "",
    faviconLetter: "C",
    faviconFontSize: "24",
    faviconBorderRadius: "6",
    faviconTextColor: "#FFFFFF",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/admin/config");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          appName: data.appName || "",
          brandName: data.brandName || "",
          description: data.description || "",
          logoPath: data.logoPath || "",
          supportEmail: data.supportEmail || "",
          faviconPath: data.faviconPath || "",
          faviconLetter: data.faviconLetter || "C",
          faviconFontSize: data.faviconFontSize || "24",
          faviconBorderRadius: data.faviconBorderRadius || "6",
          faviconTextColor: data.faviconTextColor || "#FFFFFF",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("app-config-cache");
          window.dispatchEvent(new Event("app-config-updated"));
          
          if ("BroadcastChannel" in window) {
            const channel = new BroadcastChannel("app-config-updates");
            channel.postMessage({ type: "config-updated" });
            channel.close();
          }
        }
        
        toast({
          title: "Success",
          description: "Branding configuration updated successfully",
          variant: "success",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update configuration");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Configure your application name and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appName">App Name</Label>
            <Input
              id="appName"
              value={formData.appName}
              onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Upload and manage your logo</CardDescription>
        </CardHeader>
        <CardContent>
          <LogoUpload
            currentLogoPath={formData.logoPath}
            onLogoUploaded={(logoPath: string) => {
              setFormData({ ...formData, logoPath });
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Favicon</CardTitle>
          <CardDescription>Configure favicon settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faviconLetter">Favicon Letter</Label>
            <Input
              id="faviconLetter"
              value={formData.faviconLetter}
              onChange={(e) => setFormData({ ...formData, faviconLetter: e.target.value.slice(0, 1) })}
              maxLength={1}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="faviconFontSize">Font Size</Label>
              <Input
                id="faviconFontSize"
                type="number"
                value={formData.faviconFontSize}
                onChange={(e) => setFormData({ ...formData, faviconFontSize: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faviconBorderRadius">Border Radius</Label>
              <Input
                id="faviconBorderRadius"
                type="number"
                value={formData.faviconBorderRadius}
                onChange={(e) => setFormData({ ...formData, faviconBorderRadius: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faviconTextColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="faviconTextColor"
                  type="color"
                  value={formData.faviconTextColor}
                  onChange={(e) => setFormData({ ...formData, faviconTextColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.faviconTextColor}
                  onChange={(e) => setFormData({ ...formData, faviconTextColor: e.target.value })}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
