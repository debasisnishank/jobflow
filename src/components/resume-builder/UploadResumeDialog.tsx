"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface UploadResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadResumeDialog({ open, onOpenChange }: UploadResumeDialogProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF document (.pdf)",
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
      });
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ai/resume/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to process your resume. Please try again.";
        let errorTitle = "Upload Failed";

        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.code === "RESUME_LIMIT_REACHED") {
            errorTitle = "Resume Limit Reached";
          }
        } catch (parseError) {
          errorMessage = `Failed to upload resume. Status: ${response.status}`;
        }

        toast({
          variant: "destructive",
          title: errorTitle,
          description: errorMessage,
        });
        setUploading(false);
        return;
      }

      const { resumeId } = await response.json();

      toast({
        title: "Resume Uploaded!",
        description: "AI has extracted your information. Opening editor...",
        variant: "success",
      });

      setTimeout(() => {
        router.push(`/dashboard/resume-builder/${resumeId}`);
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to process your resume. Please try again.";

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">Upload Your Resume</DialogTitle>
          <DialogDescription>
            Upload your existing resume and our AI will extract all information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                  ? "border-[#3B82F6] bg-blue-50"
                  : "border-gray-300 hover:border-[#3B82F6]"
                }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 mb-1">
                    Drop your resume here
                  </p>
                  <p className="text-xs text-gray-600">or click to browse</p>
                </div>
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={() => document.getElementById("resume-upload")?.click()}
                  variant="outline"
                  className="border-[#3B82F6]/30 hover:bg-[#3B82F6]/10"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF (Max 5MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-semibold text-gray-900 truncate text-sm">{file.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                  className="shrink-0 text-xs"
                >
                  Change
                </Button>
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload & Process
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              AI will extract:
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Contact information</li>
              <li>• Work experience with dates and descriptions</li>
              <li>• Education history</li>
              <li>• Skills and certifications</li>
              <li>• Professional summary</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

