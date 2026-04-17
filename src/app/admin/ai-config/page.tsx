import { AIConfigContainer } from "@/components/admin/ai-config/AIConfigContainer";
import { getCurrentUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";

export default async function AIConfigPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Configuration</h1>
        <p className="text-muted-foreground">
          Manage AI prompts, models, and parameters for all AI features
        </p>
      </div>
      <AIConfigContainer />
    </div>
  );
}
