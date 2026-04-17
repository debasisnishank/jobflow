"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Calendar, Sparkles, Download, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Resume } from "@/models/profile.model";
import { getResumeList } from "@/actions/profile.actions";
import Loading from "@/components/Loading";
import { CreateResumeDialog } from "./CreateResumeDialog";
import { ResumePreviewDialog } from "./ResumePreviewDialog";

interface ResumeBuilderListProps {
  onCreateResume?: () => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

export function ResumeBuilderList({ 
  onCreateResume: onCreateResumeProp,
  dialogOpen: dialogOpenProp,
  setDialogOpen: setDialogOpenProp 
}: ResumeBuilderListProps = {}) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalDialogOpen, setInternalDialogOpen] = useState(false);
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);
  
  const dialogOpen = dialogOpenProp !== undefined ? dialogOpenProp : internalDialogOpen;
  const setDialogOpen = setDialogOpenProp ?? setInternalDialogOpen;

  const loadResumes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, success, message } = await getResumeList(1, 100);
      if (success && data) {
        setResumes(data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: message || "Failed to load resumes",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load resumes",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const createNewResume = () => {
    if (onCreateResumeProp) {
      onCreateResumeProp();
    } else {
      setDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  const handlePreview = (resumeId: string) => {
    setPreviewResumeId(resumeId);
  };

  const getSectionCount = (resume: Resume) => {
    let count = 0;
    if (resume.ContactInfo) count++;
    if (resume.ResumeSections && resume.ResumeSections.length > 0) {
      count += resume.ResumeSections.length;
    }
    if (resume.Skills && resume.Skills.length > 0) count++;
    return count;
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  return (
    <>
      <CreateResumeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      {previewResumeId && (
        <ResumePreviewDialog
          open={!!previewResumeId}
          onOpenChange={(open) => !open && setPreviewResumeId(null)}
          resumeId={previewResumeId}
        />
      )}
      
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card 
            className="border-2 border-dashed border-blue-300 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            onClick={createNewResume}
          >
            <CardContent className="flex flex-col items-center justify-center min-h-[320px] gap-5 p-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                <Plus className="h-10 w-10 text-white" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Create New Resume</h3>
                <p className="text-sm text-gray-600 max-w-[220px] leading-relaxed">
                  Build a professional resume with AI assistance.
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white shadow-sm"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>

          {resumes.map((resume) => (
            <Card 
              key={resume.id} 
              className="group hover:shadow-lg hover:border-blue-200 transition-all border-gray-200 bg-white"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
                    {resume.title}
                  </CardTitle>
                  {resume.aiGenerated && (
                    <Badge className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white border-0 shadow-sm flex-shrink-0 h-5 px-2 text-[10px] font-medium">
                      AI
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Updated {formatDate(resume.updatedAt!)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{getSectionCount(resume)} sections</span>
                </div>
                {resume.atsScore !== undefined && resume.atsScore !== null && (
                  <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-md border border-blue-100">
                    <span className="text-xs font-medium text-gray-700">ATS Score</span>
                    <span className="text-lg font-bold text-blue-600">{resume.atsScore}%</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2 pt-3 border-t border-gray-100">
                <Link href={`/dashboard/resume-builder/${resume.id}`} className="flex-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 text-xs"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreview(resume.id!)}
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/resume-builder/export?resumeId=${resume.id}`);
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${resume.title}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        toast({
                          title: "Download started",
                          description: "Your resume is being downloaded.",
                          variant: "success",
                        });
                      } else {
                        throw new Error("Failed to export resume");
                      }
                    } catch (error: any) {
                      toast({
                        variant: "destructive",
                        title: "Export failed",
                        description: error.message || "Failed to export resume. Please try again.",
                      });
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {resumes.length === 0 && !loading && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-sm">
                Get started by creating your first professional resume with AI assistance.
              </p>
              <Button 
                onClick={createNewResume} 
                className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

