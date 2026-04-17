"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockInterviewSetup } from "./MockInterviewSetup";
import { MockInterviewSession } from "./MockInterviewSession";
import { MockInterviewResults } from "./MockInterviewResults";
import { MockInterviewHistory } from "./MockInterviewHistory";
import { MockInterviewSession as SessionType } from "@/models/interview.model";
import { JobResponse } from "@/models/job.model";
import { Resume } from "@/models/profile.model";

interface MockInterviewContainerProps {
  jobs: JobResponse[];
  resumes: Resume[];
  pastSessions?: SessionType[];
}

export function MockInterviewContainer({ jobs, resumes, pastSessions = [] }: MockInterviewContainerProps) {
  const [currentSession, setCurrentSession] = useState<SessionType | null>(null);
  const [sessionStatus, setSessionStatus] = useState<"setup" | "interview" | "results">("setup");

  const handleSessionStart = (session: SessionType) => {
    setCurrentSession(session);
    setSessionStatus("interview");
  };

  const handleSessionComplete = (session: SessionType) => {
    setCurrentSession(session);
    setSessionStatus("results");
  };

  const handleNewInterview = () => {
    setCurrentSession(null);
    setSessionStatus("setup");
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            AI Mock Interview <Badge variant="secondary">Beta</Badge>
          </CardTitle>
          <CardDescription>
            Practice your interview skills with AI-powered mock interviews. Get personalized questions
            and instant feedback on your answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionStatus === "setup" && (
            <MockInterviewSetup
              jobs={jobs}
              resumes={resumes}
              onSessionStart={handleSessionStart}
            />
          )}

          {sessionStatus === "interview" && currentSession && (
            <MockInterviewSession
              session={currentSession}
              onComplete={handleSessionComplete}
              onCancel={handleNewInterview}
            />
          )}

          {sessionStatus === "results" && currentSession && (
            <MockInterviewResults
              session={currentSession}
              onNewInterview={handleNewInterview}
            />
          )}
        </CardContent>
      </Card>

      {sessionStatus === "setup" && pastSessions.length > 0 && (
        <MockInterviewHistory sessions={pastSessions} />
      )}
    </div>
  );
}

