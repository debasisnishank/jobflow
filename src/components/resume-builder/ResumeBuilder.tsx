"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Download, MoreVertical, Save, Sparkles, Eye, EyeOff, FileText, Settings, BarChart3, Send, RotateCcw, RotateCw, Loader2, Trash2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateSelector } from "./TemplateSelector";
import { useRouter } from "next/navigation";
import { Resume } from "@/models/profile.model";
import { ResumeBuilderForm } from "./ResumeBuilderForm";
import { ResumePreview } from "./ResumePreview";
import { StyleSettings as StyleSettingsType, DEFAULT_SETTINGS } from "./StyleSettings";
import { StyleSettings } from "./StyleSettings";
import { ResumeScorePanel } from "./ResumeScorePanel";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeBuilderProps {
  resumeData?: any;
}

import { ResumeFormData } from "./types";

export function ResumeBuilder({ resumeData }: ResumeBuilderProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"content" | "ai" | "design" | "score">("content");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const getJobDescriptionFromQuery = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("jobDescription") || "";
    }
    return "";
  };

  const [formData, setFormData] = useState<ResumeFormData>({
    id: resumeData?.id,
    title: resumeData?.title || "Untitled Resume",
    template: resumeData?.template || "modern",
    primaryColor: resumeData?.primaryColor || "#3B82F6",
    styleSettings: resumeData?.styleSettings || DEFAULT_SETTINGS,
    jobDescription: getJobDescriptionFromQuery() || resumeData?.jobDescription || "",
    contactInfo: {
      firstName: resumeData?.ContactInfo?.firstName || "",
      lastName: resumeData?.ContactInfo?.lastName || "",
      email: resumeData?.ContactInfo?.email || "",
      phone: resumeData?.ContactInfo?.phone || "",
      address: resumeData?.ContactInfo?.address || "",
      headline: resumeData?.ContactInfo?.headline || "",
    },
    summary: resumeData?.ResumeSections?.find((s: any) => s.sectionType === "summary")?.summary?.content || "",
    workExperiences: resumeData?.ResumeSections?.flatMap((s: any) =>
      s.workExperiences?.map((w: any) => ({
        id: w.id,
        company: w.Company?.label || "",
        jobTitle: w.jobTitle?.label || "",
        location: w.location?.label || "",
        startDate: w.startDate ? new Date(w.startDate).toISOString().split('T')[0] : "",
        endDate: w.endDate ? new Date(w.endDate).toISOString().split('T')[0] : undefined,
        description: w.description || "",
        current: !w.endDate,
      })) || []
    ) || [],
    educations: resumeData?.ResumeSections?.flatMap((s: any) =>
      s.educations?.map((e: any) => ({
        id: e.id,
        institution: e.institution || "",
        degree: e.degree || "",
        fieldOfStudy: e.fieldOfStudy || "",
        location: e.location?.label || "",
        startDate: e.startDate ? new Date(e.startDate).toISOString().split('T')[0] : "",
        endDate: e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : undefined,
        description: e.description || "",
      })) || []
    ) || [],
    skills: resumeData?.Skills?.map((s: any) => ({
      id: s.id,
      name: s.name || "",
      level: s.level || "",
      category: s.category || "",
    })) || [],
    certifications: resumeData?.ResumeSections?.flatMap((s: any) =>
      s.licenseOrCertifications?.map((c: any) => ({
        id: c.id,
        title: c.title || "",
        organization: c.organization || "",
        issueDate: c.issueDate ? new Date(c.issueDate).toISOString().split('T')[0] : undefined,
        expirationDate: c.expirationDate ? new Date(c.expirationDate).toISOString().split('T')[0] : undefined,
        credentialUrl: c.credentialUrl || "",
      })) || []
    ) || [],
    customSections: resumeData?.ResumeSections?.flatMap((s: any) =>
      s.others?.map((o: any) => ({
        id: o.id,
        sectionId: s.id,
        title: o.title || "",
        content: o.content || "",
      })) || []
    ) || [],
  });

  const handleFormChange = useCallback((updates: Partial<ResumeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleStyleSettingsChange = useCallback((settings: Partial<StyleSettingsType>) => {
    setFormData((prev) => ({
      ...prev,
      styleSettings: { ...(prev.styleSettings || DEFAULT_SETTINGS), ...settings },
    }));
  }, []);

  const handleResetStyleSettings = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      styleSettings: DEFAULT_SETTINGS,
    }));
  }, []);

  const handleSendAiMessage = async () => {
    if (!aiPrompt.trim() || isAiLoading) return;

    const userMessage = aiPrompt.trim();
    setAiPrompt("");
    setAiMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsAiLoading(true);

    const assistantMessageId = aiMessages.length + 1;
    setAiMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const messages = [
        ...aiMessages,
        { role: "user", content: userMessage },
      ];

      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          resumeData: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: !done });
        accumulatedContent += chunk;
        setAiMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulatedContent,
          };
          return updated;
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to get AI response. Please try again.",
      });
      setAiMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current && (aiMessages.length > 0 || isAiLoading)) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [aiMessages, isAiLoading]);

  const handleClearChat = () => {
    setAiMessages([]);
    setAiPrompt("");
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared.",
      variant: "success",
    });
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleChange = (newTitle: string) => {
    if (newTitle.trim()) {
      handleFormChange({ title: newTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/resume-builder/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save resume");
      }

      const result = await response.json();

      if (result.resumeId && !formData.id) {
        handleFormChange({ id: result.resumeId });
        router.replace(`/dashboard/resume-builder/${result.resumeId}`);
      }

      toast({
        title: "Saved!",
        description: "Your resume has been saved successfully.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save resume. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: formData.title || "Resume",
    onAfterPrint: () => {
      toast({
        title: "Check your downloads",
        description: "Your resume PDF should be downloading or opening in a new tab.",
        variant: "success",
      });
    },
    onPrintError: (errorLocation, error) => {
      toast({
        variant: "destructive",
        title: "Print failed",
        description: error.message || "Failed to generate PDF. Please try again.",
      });
    },
  });

  const handleDownload = () => {
    if (!formData.id) {
      toast({
        variant: "destructive",
        title: "Save first",
        description: "Please save your resume before downloading.",
      });
      return;
    }

    // With persistent hidden preview, we can print immediately
    handlePrint();
  };

  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex flex-col bg-gray-50 z-50 overflow-hidden">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-3 md:px-4 lg:px-6 py-2 md:py-3 flex-shrink-0">
          <div className="w-full flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/resume-builder")}
                className="hover:bg-gray-100 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] md:text-xs text-gray-500 mb-0.5 hidden sm:block">Base Resumes</div>
                {isEditingTitle ? (
                  <Input
                    ref={titleInputRef}
                    value={formData.title}
                    onChange={(e) => handleFormChange({ title: e.target.value })}
                    onBlur={(e) => handleTitleChange(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="text-sm md:text-lg font-semibold h-auto py-1 px-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                    maxLength={100}
                  />
                ) : (
                  <div className="group">
                    <h1
                      className="text-sm md:text-lg font-semibold text-gray-900 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors truncate"
                      onClick={() => setIsEditingTitle(true)}
                      title="Click to edit"
                    >
                      <span className="truncate">{formData.title}</span>
                      <svg className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </h1>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2 flex-wrap flex-shrink-0">
              <TemplateSelector
                currentTemplate={formData.template}
                currentColor={formData.primaryColor}
                onTemplateChange={(template) => handleFormChange({ template })}
                onColorChange={(primaryColor) => handleFormChange({ primaryColor })}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="border-gray-300 hover:bg-gray-100"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Hide Preview</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Show Preview</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="border-gray-300 hover:bg-gray-100"
              >
                <Save className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
                <span className="sm:hidden"><Save className="h-4 w-4" /></span>
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Download Resume</span>
                <span className="sm:hidden">Download</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 hidden md:flex"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    More options coming soon
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          <div className={cn(
            "w-full border-r border-gray-200 bg-white flex-shrink-0 overflow-hidden flex flex-col transition-all duration-300",
            showPreview ? "lg:w-[560px] xl:w-[600px]" : "lg:w-full"
          )}>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "content" | "ai" | "design" | "score")} className="flex flex-col h-full">
              <TabsList className="bg-transparent p-0 h-auto border-b border-gray-200 rounded-none flex-shrink-0">
                <TabsTrigger
                  value="content"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-2 md:px-3 lg:px-4 py-2.5 flex-1 text-xs md:text-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden md:inline">Resume Content</span>
                  <span className="md:hidden">Content</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-2 md:px-3 lg:px-4 py-2.5 flex-1 text-xs md:text-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden md:inline">AI Assistant</span>
                  <span className="md:hidden">AI</span>
                </TabsTrigger>
                <TabsTrigger
                  value="score"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-2 md:px-3 lg:px-4 py-2.5 flex-1 text-xs md:text-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <BarChart3 className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden md:inline">Score Evaluation</span>
                  <span className="md:hidden">Score</span>
                </TabsTrigger>
                <TabsTrigger
                  value="design"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-2 md:px-3 lg:px-4 py-2.5 flex-1 text-xs md:text-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden md:inline">Design</span>
                  <span className="md:hidden">Design</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                {activeTab === "content" && (
                  <ResumeBuilderForm
                    formData={formData}
                    onChange={handleFormChange}
                  />
                )}
                {activeTab === "ai" && (
                  <div className="h-full flex flex-col">
                    <div className="p-4 md:p-6 flex-shrink-0 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900">AI Assistant</h2>
                          <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                            Beta
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={handleClearChat}
                              disabled={aiMessages.length === 0}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clear Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={chatContainerRef}>
                      <div className="max-w-2xl mx-auto space-y-6">
                        {aiMessages.length === 0 && (
                          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                              Let AI help you sharpen your resume. Ask it to rewrite bullets for clarity and impact, tailor content to a job description, adjust tone, or quantify results.
                            </p>

                            <div>
                              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">What you can do</h3>
                              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-600 mt-1">•</span>
                                  <span>Rewrite bullets to be concise, metric-driven, and action-oriented.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-600 mt-1">•</span>
                                  <span>Tailor your resume to a specific role or job description.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-600 mt-1">•</span>
                                  <span>Fix grammar, tone, and highlight measurable outcomes.</span>
                                </li>
                              </ul>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                              <p className="text-sm text-gray-600 mb-2">Try:</p>
                              <p className="text-sm text-gray-500 italic">
                                "Rewrite this bullet to be concise and metrics-driven:"
                              </p>
                            </div>
                          </div>
                        )}

                        {aiMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-4 ${message.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                                }`}
                            >
                              <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        ))}

                        {isAiLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                              <span className="text-sm text-gray-600">AI is thinking...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 border-t border-gray-200 p-4 md:p-6">
                      <div className="max-w-2xl mx-auto">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-gray-100 p-0"
                            >
                              <RotateCcw className="h-3 w-3 text-gray-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-gray-100 p-0"
                            >
                              <RotateCw className="h-3 w-3 text-gray-400" />
                            </Button>
                          </div>
                          <input
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendAiMessage();
                              }
                            }}
                            placeholder="Tell us what you have in mind..."
                            className="w-full pl-24 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            disabled={isAiLoading}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSendAiMessage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
                            disabled={!aiPrompt.trim() || isAiLoading}
                          >
                            {isAiLoading ? (
                              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Our AI assistant can make mistakes. Please verify responses.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "score" && (
                  <div className="p-4 md:p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-4">
                          Add a job description to see skill match score
                        </p>
                        <textarea
                          value={formData.jobDescription || ""}
                          onChange={(e) => handleFormChange({ jobDescription: e.target.value })}
                          placeholder="Paste the job description here to calculate skill match..."
                          rows={12}
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "design" && (
                  <StyleSettings
                    settings={formData.styleSettings || DEFAULT_SETTINGS}
                    onChange={handleStyleSettingsChange}
                    onReset={handleResetStyleSettings}
                  />
                )}
              </div>
            </Tabs>
          </div>

          {showPreview && (
            <>
              <div className="flex-1 overflow-y-auto bg-gray-100 flex items-center justify-center p-2 md:p-4 hidden lg:flex">
                <ResumePreview
                  formData={formData}
                  template={formData.template}
                  primaryColor={formData.primaryColor}
                  styleSettings={formData.styleSettings || DEFAULT_SETTINGS}
                />
              </div>

              <div className="w-24 lg:w-28 border-l border-gray-200 bg-white flex-shrink-0 overflow-y-auto hidden lg:block">
                <ResumeScorePanel
                  formData={formData}
                  jobDescription={formData.jobDescription}
                />
              </div>
            </>
          )}

          {!showPreview && (
            <div className="flex-1 flex items-center justify-center bg-gray-100 hidden lg:flex">
              <div className="text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Preview is hidden</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                  className="mt-4"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </Button>
              </div>
            </div>
          )}

          {showPreview && (
            <div className="lg:hidden fixed inset-0 z-[60] bg-white overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-lg font-semibold">Resume Preview</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(false)}
                  className="hover:bg-gray-100"
                >
                  <EyeOff className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 bg-gray-50 min-h-full">
                <ResumePreview
                  formData={formData}
                  template={formData.template}
                  primaryColor={formData.primaryColor}
                  styleSettings={formData.styleSettings || DEFAULT_SETTINGS}
                />
              </div>
            </div>
          )}

          {/* Hidden preview for printing only - key for download functionality */}
          <div className="hidden print:block absolute inset-0 z-[-1]">
            <ResumePreview
              ref={componentRef}
              formData={formData}
              template={formData.template}
              primaryColor={formData.primaryColor}
              styleSettings={formData.styleSettings || DEFAULT_SETTINGS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

