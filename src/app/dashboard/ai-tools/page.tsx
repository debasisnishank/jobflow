import { redirect } from "next/navigation";

export default async function AIToolsPage() {
  redirect("/dashboard/resume-builder/ai-tools?tool=analysis");
}

