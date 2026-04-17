import { Metadata } from "next";
import { ResumeBuilder } from "@/components/resume-builder/ResumeBuilder";

export const metadata: Metadata = {
  title: "New Resume | AI Resume Builder",
  description: "Create a new professional resume with AI assistance",
};

export default function NewResumePage() {
  return <ResumeBuilder />;
}

