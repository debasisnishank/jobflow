"use client";

import type { ComponentType } from "react";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, BookOpen, FileText, PenTool, Sparkles } from "lucide-react";
import { ResumeAnalysis } from "@/components/ai-tools/ResumeAnalysis";
import { ResumeSummaryWriter } from "@/components/ai-tools/ResumeSummaryWriter";
import { CoverLetterWriter } from "@/components/ai-tools/CoverLetterWriter";
import { ResumeWritingGuidance } from "@/components/ai-tools/ResumeWritingGuidance";

type ToolKey = "analysis" | "summary" | "cover-letter" | "guidance";

const TOOL_OPTIONS: Array<{
  key: ToolKey;
  label: string;
  description: string;
  highlights: string[];
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    key: "analysis",
    label: "Resume Analysis",
    description: "Get actionable feedback to improve clarity, impact, and ATS readiness.",
    highlights: ["ATS score insights", "Section-level recommendations", "Keyword & impact suggestions"],
    icon: FileText,
  },
  {
    key: "summary",
    label: "Summary Writer",
    description: "Generate a professional summary tailored to your resume content.",
    highlights: ["Role-aligned tone", "Concise, ATS-friendly writing", "Easy copy & iterate"],
    icon: Sparkles,
  },
  {
    key: "cover-letter",
    label: "Cover Letter",
    description: "Generate a customized cover letter for a specific job application.",
    highlights: ["Uses your resume + job details", "Professional formatting", "Streaming generation"],
    icon: PenTool,
  },
  {
    key: "guidance",
    label: "Guidance",
    description: "Best practices for formatting, ATS optimization, and high-impact bullets.",
    highlights: ["Formatting rules", "ATS optimization checklist", "Bullet writing framework"],
    icon: BookOpen,
  },
];

function isToolKey(value: string | null): value is ToolKey {
  return value === "analysis" || value === "summary" || value === "cover-letter" || value === "guidance";
}

export function ResumeBuilderAIToolsContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTool: ToolKey = useMemo(() => {
    const raw = searchParams.get("tool");
    if (isToolKey(raw)) return raw;
    return "analysis";
  }, [searchParams]);

  const onChangeTool = (tool: ToolKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tool", tool);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const ActiveToolComponent = useMemo(() => {
    switch (activeTool) {
      case "analysis":
        return <ResumeAnalysis />;
      case "summary":
        return <ResumeSummaryWriter />;
      case "cover-letter":
        return <CoverLetterWriter />;
      case "guidance":
        return <ResumeWritingGuidance />;
    }
  }, [activeTool]);

  const activeMeta = TOOL_OPTIONS.find((o) => o.key === activeTool);
  const ActiveIcon = activeMeta?.icon ?? Sparkles;

  return (
    <Card className="w-full border border-border/70 shadow-lg overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-br from-blue-50 via-background to-background">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-10 w-10 rounded-xl bg-white shadow-sm border border-border/60 flex items-center justify-center">
              <ActiveIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {activeMeta?.label ?? "Resume Builder AI Tools"}
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  AI Tools
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {activeMeta?.description ??
                  "AI-powered tools for analysis, summary writing, cover letters, and guidance."}
              </p>

              {activeMeta?.highlights?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeMeta.highlights.slice(0, 3).map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1 text-xs text-muted-foreground"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                      {h}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="w-full sm:w-[260px]">
            <div className="text-xs font-medium text-muted-foreground mb-2">Select tool</div>
            <Select value={activeTool} onValueChange={(v) => onChangeTool(v as ToolKey)}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select AI tool" />
              </SelectTrigger>
              <SelectContent>
                {TOOL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.key} value={opt.key}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 bg-gradient-to-b from-background to-muted/10">
        {ActiveToolComponent}
      </CardContent>
    </Card>
  );
}

