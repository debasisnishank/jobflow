import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMockInterviewSessionById } from "@/actions/interviews.actions";
import { MockInterviewResults } from "@/components/mock-interview/MockInterviewResults";
import { MockInterviewSession } from "@/components/mock-interview/MockInterviewSession";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MockInterviewPageClient } from "./MockInterviewPageClient";

interface MockInterviewDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MockInterviewDetailPage({
  params,
}: MockInterviewDetailPageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const result = await getMockInterviewSessionById(params.id);

  if (!result.success || !result.data) {
    return (
      <div className="col-span-3 w-full py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {result.message || "Interview session not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const interviewSession = result.data;

  if (interviewSession.status === "completed") {
    return (
      <div className="col-span-3 w-full">
        <MockInterviewResults
          session={interviewSession}
          showVideo={!!interviewSession.videoRecordingUrl}
        />
      </div>
    );
  }

  return (
    <div className="col-span-3 w-full">
      <MockInterviewPageClient session={interviewSession} />
    </div>
  );
}
