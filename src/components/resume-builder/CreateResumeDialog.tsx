"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Briefcase, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { UploadResumeDialog } from "./UploadResumeDialog";
import { JobTailoredDialog } from "./JobTailoredDialog";

interface CreateResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateResumeDialog({ open, onOpenChange }: CreateResumeDialogProps) {
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [jobTailoredDialogOpen, setJobTailoredDialogOpen] = useState(false);

  const resumeTypes = [
    {
      id: "base",
      title: "Base Resume",
      description: "Your main document to keep all your professional information organized and up to date.",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: "job-tailored",
      title: "Job Tailored Resume",
      description: "This version highlights your most relevant skills and experience for a specific job.",
      icon: Briefcase,
      color: "bg-purple-500",
    },
    {
      id: "scratch",
      title: "Start from Scratch",
      description: "Create a completely new resume with a blank template and customize every detail.",
      icon: PlusCircle,
      color: "bg-green-500",
    },
  ];

  const handleSelect = (typeId: string) => {
    onOpenChange(false);
    
    if (typeId === "base") {
      setTimeout(() => setUploadDialogOpen(true), 300);
    } else if (typeId === "job-tailored") {
      setTimeout(() => setJobTailoredDialogOpen(true), 300);
    } else if (typeId === "scratch") {
      router.push("/dashboard/resume-builder/new");
    }
  };

  return (
    <>
      <UploadResumeDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      <JobTailoredDialog open={jobTailoredDialogOpen} onOpenChange={setJobTailoredDialogOpen} />
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Resume</DialogTitle>
          <DialogDescription>
            Go with the option that fits best for you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {resumeTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-[#3B82F6] group"
                onClick={() => handleSelect(type.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`${type.color} p-3 rounded-lg shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#3B82F6] transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

