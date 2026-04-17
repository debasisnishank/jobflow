"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/utils/user.utils";
import { revalidatePath } from "next/cache";
import { AuthenticationError, ValidationError } from "@/lib/errors";
import { 
  Interview, 
  InterviewForm, 
  MockInterviewSession, 
  MockInterviewQuestion 
} from "@/models/interview.model";

// ==================== Regular Interviews ====================

export async function getInterviewsByJobId(
  jobId: string
): Promise<{ data: Interview[]; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    // Verify job belongs to user
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        userId: user.id,
      },
    });

    if (!job) {
      throw new ValidationError("Job not found");
    }

    const interviews = await prisma.interview.findMany({
      where: {
        jobId,
      },
      include: {
        job: {
          include: {
            JobTitle: true,
            Company: true,
            Status: true,
            Location: true,
            JobSource: true,
          },
        },
        interviewers: true,
      },
      orderBy: [
        { scheduledDate: "asc" },
        { round: "asc" },
      ],
    });

    return {
      data: interviews as Interview[],
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch interviews";
    return {
      data: [],
      success: false,
      message: errorMessage,
    };
  }
}

export async function getInterviewById(
  interviewId: string
): Promise<{ data: Interview | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        job: {
          userId: user.id,
        },
      },
      include: {
        job: {
          include: {
            JobTitle: true,
            Company: true,
            Status: true,
            Location: true,
            JobSource: true,
          },
        },
        interviewers: true,
      },
    });

    return {
      data: interview as Interview | null,
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch interview";
    return {
      data: null,
      success: false,
      message: errorMessage,
    };
  }
}

export async function createInterview(
  formData: InterviewForm
): Promise<{ data: Interview | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    // Verify job belongs to user
    const job = await prisma.job.findFirst({
      where: {
        id: formData.jobId,
        userId: user.id,
      },
    });

    if (!job) {
      throw new ValidationError("Job not found");
    }

    // Verify all interviewers belong to user
    if (formData.interviewerIds.length > 0) {
      const interviewers = await prisma.contact.findMany({
        where: {
          id: { in: formData.interviewerIds },
          createdBy: user.id,
        },
      });

      if (interviewers.length !== formData.interviewerIds.length) {
        throw new ValidationError("One or more interviewers not found");
      }
    }

    const interview = await prisma.interview.create({
      data: {
        jobId: formData.jobId,
        type: formData.type,
        round: formData.round,
        status: formData.status,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime || null,
        duration: formData.duration || null,
        location: formData.location || null,
        meetingLink: formData.meetingLink || null,
        notes: formData.notes || null,
        questions: formData.questions || [],
        feedback: formData.feedback || null,
        rating: formData.rating || null,
        outcome: formData.outcome || null,
        interviewerNames: formData.interviewerNames || [],
        preparationNotes: formData.preparationNotes || null,
        interviewers: {
          connect: formData.interviewerIds.map(id => ({ id })),
        },
      },
      include: {
        job: {
          include: {
            JobTitle: true,
            Company: true,
            Status: true,
            Location: true,
            JobSource: true,
          },
        },
        interviewers: true,
      },
    });

    revalidatePath(`/dashboard/myjobs/${formData.jobId}`);
    revalidatePath("/dashboard/myjobs");
    
    return {
      data: interview as Interview,
      success: true,
    };
  } catch (error: unknown) {
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : "Failed to create interview",
    };
  }
}

export async function updateInterview(
  interviewId: string,
  formData: Partial<InterviewForm>
): Promise<{ data: Interview | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    // Verify interview belongs to user's job
    const existingInterview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        job: {
          userId: user.id,
        },
      },
    });

    if (!existingInterview) {
      throw new ValidationError("Interview not found");
    }

    // Verify interviewers if provided
    if (formData.interviewerIds && formData.interviewerIds.length > 0) {
      const interviewers = await prisma.contact.findMany({
        where: {
          id: { in: formData.interviewerIds },
          createdBy: user.id,
        },
      });

      if (interviewers.length !== formData.interviewerIds.length) {
        throw new ValidationError("One or more interviewers not found");
      }
    }

    const updateData: any = {};
    
    if (formData.type !== undefined) updateData.type = formData.type;
    if (formData.round !== undefined) updateData.round = formData.round;
    if (formData.status !== undefined) updateData.status = formData.status;
    if (formData.scheduledDate !== undefined) updateData.scheduledDate = formData.scheduledDate;
    if (formData.scheduledTime !== undefined) updateData.scheduledTime = formData.scheduledTime;
    if (formData.duration !== undefined) updateData.duration = formData.duration;
    if (formData.location !== undefined) updateData.location = formData.location;
    if (formData.meetingLink !== undefined) updateData.meetingLink = formData.meetingLink;
    if (formData.notes !== undefined) updateData.notes = formData.notes;
    if (formData.questions !== undefined) updateData.questions = formData.questions;
    if (formData.feedback !== undefined) updateData.feedback = formData.feedback;
    if (formData.rating !== undefined) updateData.rating = formData.rating;
    if (formData.outcome !== undefined) updateData.outcome = formData.outcome;
    if (formData.interviewerNames !== undefined) updateData.interviewerNames = formData.interviewerNames;
    if (formData.preparationNotes !== undefined) updateData.preparationNotes = formData.preparationNotes;

    const interview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        ...updateData,
        ...(formData.interviewerIds && {
          interviewers: {
            set: formData.interviewerIds.map(id => ({ id })),
          },
        }),
      },
      include: {
        job: {
          include: {
            JobTitle: true,
            Company: true,
            Status: true,
            Location: true,
            JobSource: true,
          },
        },
        interviewers: true,
      },
    });

    revalidatePath(`/dashboard/myjobs/${existingInterview.jobId}`);
    revalidatePath("/dashboard/myjobs");
    
    return {
      data: interview as Interview,
      success: true,
    };
  } catch (error: unknown) {
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : "Failed to update interview",
    };
  }
}

export async function deleteInterview(
  interviewId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        job: {
          userId: user.id,
        },
      },
    });

    if (!interview) {
      throw new ValidationError("Interview not found");
    }

    await prisma.interview.delete({
      where: { id: interviewId },
    });

    revalidatePath(`/dashboard/myjobs/${interview.jobId}`);
    revalidatePath("/dashboard/myjobs");
    
    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete interview",
    };
  }
}

// ==================== Mock Interview Sessions ====================

export async function getMockInterviewSessions(
  page = 1,
  limit = 15,
  jobId?: string
): Promise<{ data: MockInterviewSession[]; total: number; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const skip = (page - 1) * limit;
    const where: any = {
      userId: user.id,
    };

    if (jobId) {
      where.jobId = jobId;
    }

    const [sessions, total] = await Promise.all([
      prisma.mockInterviewSession.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startedAt: "desc" },
        include: {
          job: {
            include: {
              JobTitle: true,
              Company: true,
              Status: true,
              Location: true,
              JobSource: true,
            },
          },
          resume: true,
          questions: {
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.mockInterviewSession.count({ where }),
    ]);

    return {
      data: sessions as MockInterviewSession[],
      total,
      success: true,
    };
  } catch (error: unknown) {
    return {
      data: [],
      total: 0,
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch mock interview sessions",
    };
  }
}

export async function getMockInterviewSessionById(
  sessionId: string
): Promise<{ data: MockInterviewSession | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const session = await prisma.mockInterviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
      include: {
        job: {
          include: {
            JobTitle: true,
            Company: true,
            Status: true,
            Location: true,
            JobSource: true,
          },
        },
        resume: true,
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      data: session as MockInterviewSession | null,
      success: true,
    };
  } catch (error: unknown) {
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch mock interview session",
    };
  }
}

export async function createMockInterviewSession(
  data: {
    jobId?: string;
    resumeId?: string;
    title: string;
    interviewType: "technical" | "behavioral" | "mixed";
    scenarioId?: string;
  }
): Promise<{ data: MockInterviewSession | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    // Validate mock interview usage limits
    const { validateMockInterviewUsage } = await import("@/lib/feature-validation");
    const validation = await validateMockInterviewUsage();
    if (!validation.allowed) {
      return {
        data: null,
        success: false,
        message: validation.message || "Mock interview limit reached",
      };
    }

    // Verify job belongs to user if provided
    if (data.jobId) {
      const job = await prisma.job.findFirst({
        where: {
          id: data.jobId,
          userId: user.id,
        },
      });

      if (!job) {
        throw new ValidationError("Job not found");
      }
    }

    // Verify resume belongs to user if provided
    if (data.resumeId) {
      const resume = await prisma.resume.findFirst({
        where: {
          id: data.resumeId,
          profile: {
            userId: user.id,
          },
        },
      });

      if (!resume) {
        throw new ValidationError("Resume not found");
      }
    }

    const session = await prisma.mockInterviewSession.create({
      data: {
        userId: user.id,
        jobId: data.jobId || null,
        resumeId: data.resumeId || null,
        title: data.title,
        interviewType: data.interviewType,
        ...(data.scenarioId && { scenarioId: data.scenarioId }),
        status: "in_progress",
      },
      include: {
        job: {
          include: {
            JobTitle: true,
            Company: true,
            Status: true,
            Location: true,
            JobSource: true,
          },
        },
        resume: true,
        questions: true,
      },
    });

    revalidatePath("/dashboard/interviews");
    
    return {
      data: session as MockInterviewSession,
      success: true,
    };
  } catch (error: unknown) {
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : "Failed to create mock interview session",
    };
  }
}

export async function updateMockInterviewSession(
  sessionId: string,
  data: Partial<{
    status: "in_progress" | "completed" | "abandoned";
    overallFeedback: string;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    completedAt: Date;
    duration: number;
    dailyRoomId: string;
    videoRecordingUrl: string;
    videoDuration: number;
    transcript: string;
    transcriptSegments: string;
    conversationFlow: string;
    cheatingAnalysis: string;
    behaviorMetrics: string;
  }>
): Promise<{ data: MockInterviewSession | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const session = await prisma.mockInterviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!session) {
      throw new ValidationError("Mock interview session not found");
    }

    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.overallFeedback !== undefined) updateData.overallFeedback = data.overallFeedback;
    if (data.overallScore !== undefined) updateData.overallScore = data.overallScore;
    if (data.strengths !== undefined) updateData.strengths = data.strengths;
    if (data.improvements !== undefined) updateData.improvements = data.improvements;
    if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;
    if (data.duration !== undefined) updateData.duration = data.duration;
    
    // Video interview fields
    if (data.dailyRoomId !== undefined) updateData.dailyRoomId = data.dailyRoomId;
    if (data.videoRecordingUrl !== undefined) updateData.videoRecordingUrl = data.videoRecordingUrl;
    if (data.videoDuration !== undefined) updateData.videoDuration = data.videoDuration;
    if (data.transcript !== undefined) updateData.transcript = data.transcript;
    if (data.transcriptSegments !== undefined) updateData.transcriptSegments = data.transcriptSegments;
    if (data.conversationFlow !== undefined) updateData.conversationFlow = data.conversationFlow;
    if (data.cheatingAnalysis !== undefined) updateData.cheatingAnalysis = data.cheatingAnalysis;
    if (data.behaviorMetrics !== undefined) updateData.behaviorMetrics = data.behaviorMetrics;

    const updatedSession = await prisma.mockInterviewSession.update({
      where: { id: sessionId },
      data: updateData,
      include: {
        job: {
          include: {
            JobTitle: true,
            Company: true,
            Status: true,
            Location: true,
            JobSource: true,
          },
        },
        resume: true,
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath("/dashboard/interviews");
    
    return {
      data: updatedSession as MockInterviewSession,
      success: true,
    };
  } catch (error: unknown) {
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : "Failed to update mock interview session",
    };
  }
}

export async function addMockInterviewQuestion(
  sessionId: string,
  question: {
    question: string;
    questionType: string;
    order: number;
    isFollowUp?: boolean;
    parentQuestionId?: string | null;
  }
): Promise<{ data: MockInterviewQuestion | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const session = await prisma.mockInterviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!session) {
      throw new ValidationError("Mock interview session not found");
    }

    const questionRecord = await prisma.mockInterviewQuestion.create({
      data: {
        sessionId,
        question: question.question,
        questionType: question.questionType,
        order: question.order,
        isFollowUp: question.isFollowUp || false,
        parentQuestionId: question.parentQuestionId || null,
      },
    });

    revalidatePath("/dashboard/interviews");
    
    return {
      data: questionRecord as MockInterviewQuestion,
      success: true,
    };
  } catch (error: unknown) {
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : "Failed to add question",
    };
  }
}

export async function updateMockInterviewQuestion(
  questionId: string,
  data: Partial<{
    userAnswer: string;
    answeredAt: Date;
    aiFeedback: string;
    score: number;
    strengths: string[];
    suggestions: string[];
  }>
): Promise<{ data: MockInterviewQuestion | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const question = await prisma.mockInterviewQuestion.findFirst({
      where: {
        id: questionId,
        session: {
          userId: user.id,
        },
      },
    });

    if (!question) {
      throw new ValidationError("Question not found");
    }

    const updateData: any = {};
    if (data.userAnswer !== undefined) updateData.userAnswer = data.userAnswer;
    if (data.answeredAt !== undefined) updateData.answeredAt = data.answeredAt;
    if (data.aiFeedback !== undefined) updateData.aiFeedback = data.aiFeedback;
    if (data.score !== undefined) updateData.score = data.score;
    if (data.strengths !== undefined) updateData.strengths = data.strengths;
    if (data.suggestions !== undefined) updateData.suggestions = data.suggestions;

    const updatedQuestion = await prisma.mockInterviewQuestion.update({
      where: { id: questionId },
      data: updateData,
    });

    revalidatePath("/dashboard/interviews");
    
    return {
      data: updatedQuestion as MockInterviewQuestion,
      success: true,
    };
  } catch (error: unknown) {
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : "Failed to update question",
    };
  }
}

export async function deleteMockInterviewSession(
  sessionId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const session = await prisma.mockInterviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!session) {
      throw new ValidationError("Mock interview session not found");
    }

    await prisma.mockInterviewSession.delete({
      where: { id: sessionId },
    });

    revalidatePath("/dashboard/interviews");
    
    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete mock interview session",
    };
  }
}

