"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ResumeAnalysis } from "./ResumeAnalysis";
import { ResumeSummaryWriter } from "./ResumeSummaryWriter";
import { CoverLetterWriter } from "./CoverLetterWriter";
import { ResumeWritingGuidance } from "./ResumeWritingGuidance";
import { FileText, Sparkles, PenTool, BookOpen } from "lucide-react";
import { AIToolsHeader } from "./AIToolsHeader";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "analysis",
    label: "Resume Analysis",
    icon: FileText,
    component: ResumeAnalysis,
  },
  {
    id: "summary",
    label: "Summary Writer",
    icon: Sparkles,
    component: ResumeSummaryWriter,
  },
  {
    id: "cover-letter",
    label: "Cover Letter",
    icon: PenTool,
    component: CoverLetterWriter,
  },
  {
    id: "guidance",
    label: "Guidance",
    icon: BookOpen,
    component: ResumeWritingGuidance,
  },
];

export function AIToolsContainer() {
  const [activeTab, setActiveTab] = useState("analysis");

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || ResumeAnalysis;

  return (
    <Card className="w-full border border-border/70 shadow-lg">
      <AIToolsHeader />
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "h-11 px-6 gap-2 font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white hover:from-[#2563EB] hover:to-[#1E3A8A] shadow-sm"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="mt-6">
            <ActiveComponent />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
