"use client";

import { useRouter } from "next/navigation";
import { MockInterviewSession } from "@/components/mock-interview/MockInterviewSession";
import { MockInterviewSession as SessionType } from "@/models/interview.model";

interface MockInterviewPageClientProps {
  session: SessionType;
}

export function MockInterviewPageClient({ session }: MockInterviewPageClientProps) {
  const router = useRouter();

  return (
    <MockInterviewSession
      session={session}
      onComplete={(updatedSession) => {
        router.push(`/dashboard/mock-interview/${updatedSession.id}`);
        router.refresh();
      }}
      onCancel={() => {
        router.push("/dashboard/mock-interview");
      }}
    />
  );
}
