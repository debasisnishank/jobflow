import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getResumeList } from "@/actions/profile.actions";
import { LinkedInPost } from "@/components/ai-toolbox/LinkedInPost";
import { Card } from "@/components/ui/card";

import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `LinkedIn Post | ${appConfig.brandName}`,
  description: "Generate engaging LinkedIn posts",
};

export default async function LinkedInPostPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const resumesResult = await getResumeList();
  const resumes = resumesResult.success
    ? (Array.isArray(resumesResult.data) ? resumesResult.data : (resumesResult.data ? [resumesResult.data] : []))
    : [];

  return (
    <div className="col-span-3 w-full">
      <Card className="p-6">
        <LinkedInPost resumes={resumes} />
      </Card>
    </div>
  );
}

