"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2, X } from "lucide-react";
import Image from "next/image";

interface LogoUploadProps {
  currentLogoPath: string;
  onLogoUploaded: (logoPath: string) => void;
}

export function LogoUpload({ currentLogoPath, onLogoUploaded }: LogoUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/config/logo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onLogoUploaded(data.logoPath);
        
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
          description: "Logo uploaded successfully",
          variant: "success",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload logo");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentLogoPath && (
        <div className="relative inline-block">
          <Image
            src={currentLogoPath}
            alt="Current logo"
            width={200}
            height={200}
            className="border rounded-lg"
          />
        </div>
      )}
      {preview && (
        <div className="relative inline-block">
          <Image
            src={preview}
            alt="Preview"
            width={200}
            height={200}
            className="border rounded-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setPreview(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="logo">Upload Logo</Label>
        <div className="flex items-center gap-4">
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="cursor-pointer"
          />
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        <p className="text-sm text-muted-foreground">
          Recommended: PNG or SVG, max 5MB
        </p>
      </div>
    </div>
  );
}
