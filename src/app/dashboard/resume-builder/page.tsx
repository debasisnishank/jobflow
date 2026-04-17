import { Metadata } from "next";
import { ResumeBuilderContainer } from "@/components/resume-builder/ResumeBuilderContainer";

export const metadata: Metadata = {
  title: "AI Resume Builder",
  description: "Build professional ATS-friendly resumes with AI assistance",
};

export default function ResumeBuilderPage() {
  return (
    <div className="col-span-3">
      <ResumeBuilderContainer />
    </div>
  );
}

