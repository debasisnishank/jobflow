import { Metadata } from "next";
import { ResumeBuilderAIToolsContainer } from "@/components/ai-tools/ResumeBuilderAIToolsContainer";

export const metadata: Metadata = {
  title: "Resume Builder AI Tools",
  description: "AI-powered tools for resume analysis, summary writing, cover letter generation, and writing guidance",
};

export default function ResumeBuilderAIToolsPage() {
  return (
    <div className="col-span-3 w-full">
      <ResumeBuilderAIToolsContainer />
    </div>
  );
}

