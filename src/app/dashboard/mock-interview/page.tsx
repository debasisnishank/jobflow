import { Metadata } from "next";
import { MockInterviewContainer } from "@/components/mock-interview/MockInterviewContainer";
import { getJobsList } from "@/actions/job.actions";
import { getResumeList } from "@/actions/profile.actions";
import { getMockInterviewSessions } from "@/actions/interviews.actions";
import { JobResponse } from "@/models/job.model";

import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `AI Mock Interview | ${appConfig.brandName}`,
  description: "Practice your interview skills with AI-powered mock interviews",
};

export default async function MockInterviewPage() {
  // Fetch jobs, resumes, and past sessions
  const [jobsResult, resumesResult, sessionsResult] = await Promise.all([
    getJobsList(1, 100),
    getResumeList(),
    getMockInterviewSessions(1, 10),
  ]);

  const jobs: JobResponse[] = jobsResult.success && "data" in jobsResult 
    ? jobsResult.data.map(job => ({
        ...job,
        userId: "",
        salaryRange: "",
        salaryCurrency: undefined,
        description: "",
        jobUrl: "",
        applied: false,
        createdAt: new Date(),
      } as JobResponse))
    : [];
  const resumes = resumesResult.success 
    ? (Array.isArray(resumesResult.data) ? resumesResult.data : (resumesResult.data ? [resumesResult.data] : []))
    : [];
  const pastSessions = sessionsResult.success ? sessionsResult.data.filter(s => s.status === "completed") : [];

  return (
    <div className="col-span-3 w-full">
      <MockInterviewContainer 
        jobs={jobs} 
        resumes={resumes} 
        pastSessions={pastSessions}
      />
    </div>
  );
}

