import { JobResponse } from "./job.model";
import { Contact } from "./contact.model";
import { Resume } from "./profile.model";

export interface Interview {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  jobId: string;
  job?: JobResponse;
  interviewers: Contact[];
  
  // Interview details
  type: InterviewType;
  round: number;
  status: InterviewStatus;
  scheduledDate: Date | null;
  scheduledTime: string | null;
  duration: number | null;
  location: string | null;
  meetingLink: string | null;
  
  // Interview content
  notes: string | null;
  questions: string[];
  feedback: string | null;
  rating: number | null;
  outcome: InterviewOutcome | null;
  
  // Additional metadata
  interviewerNames: string[];
  preparationNotes: string | null;
}

export interface InterviewForm {
  id?: string;
  jobId: string;
  interviewerIds: string[];
  type: InterviewType;
  round: number;
  status: InterviewStatus;
  scheduledDate: Date | null;
  scheduledTime: string | null;
  duration: number | null;
  location: string | null;
  meetingLink: string | null;
  notes: string | null;
  questions: string[];
  feedback: string | null;
  rating: number | null;
  outcome: InterviewOutcome | null;
  interviewerNames: string[];
  preparationNotes: string | null;
}

export type InterviewType = "phone" | "video" | "onsite" | "other";

export type InterviewStatus = 
  | "scheduled" 
  | "completed" 
  | "cancelled" 
  | "rescheduled" 
  | "no_show";

export type InterviewOutcome = 
  | "positive" 
  | "negative" 
  | "neutral" 
  | "pending";

export interface MockInterviewSession {
  id: string;
  userId: string;
  jobId: string | null;
  job?: JobResponse;
  resumeId: string | null;
  resume?: Resume;
  
  // Session details
  title: string;
  interviewType: MockInterviewType;
  status: MockInterviewStatus;
  startedAt: Date;
  completedAt: Date | null;
  duration: number | null;
  
  // Video interview fields
  dailyRoomId: string | null;
  videoRecordingUrl: string | null;
  videoDuration: number | null;
  transcript: string | null;
  transcriptSegments: any | null; // JSON type
  conversationFlow: any | null; // JSON type
  
  // Analysis fields
  cheatingAnalysis: any | null; // JSON type
  behaviorMetrics: any | null; // JSON type
  
  // Interview content
  questions: MockInterviewQuestion[];
  overallFeedback: string | null;
  overallScore: number | null;
  strengths: string[];
  improvements: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface MockInterviewQuestion {
  id: string;
  sessionId: string;
  
  // Question details
  question: string;
  questionType: QuestionType;
  order: number;
  isFollowUp: boolean;
  parentQuestionId: string | null;
  
  // User response
  userAnswer: string | null;
  answeredAt: Date | null;
  answerDuration: number | null;
  
  // AI feedback
  aiFeedback: string | null;
  score: number | null;
  strengths: string[];
  suggestions: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type MockInterviewType = "technical" | "behavioral" | "mixed";

export type MockInterviewStatus = "in_progress" | "completed" | "abandoned";

export type QuestionType = 
  | "behavioral" 
  | "technical" 
  | "situational" 
  | "case_study" 
  | "system_design" 
  | "other";

