import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getResumeList } from "@/actions/profile.actions";
import { EmailWriter } from "@/components/ai-toolbox/EmailWriter";
import { Card } from "@/components/ui/card";

import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `Email Writer | ${appConfig.brandName}`,
  description: "Generate professional emails for job applications",
};

export default async function EmailWriterPage() {
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
        <EmailWriter resumes={resumes} />
      </Card>
    </div>
  );
}

