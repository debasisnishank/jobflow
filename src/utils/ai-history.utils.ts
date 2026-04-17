"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/utils/user.utils";

export interface AIToolboxHistoryInput {
  toolType: string;
  toolName: string;
  inputData: Record<string, any>;
  output?: string;
  resumeId?: string;
}

export async function saveAIToolboxHistory(
  data: AIToolboxHistoryInput
): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return; // Silently fail if user not found
    }

    await prisma.aIToolboxHistory.create({
      data: {
        userId: user.id,
        toolType: data.toolType,
        toolName: data.toolName,
        inputData: data.inputData as any,
        output: data.output || null,
        outputLength: data.output?.length || null,
        resumeId: data.resumeId || null,
      },
    });

    // Track AI usage for billing
    const { incrementAIUsage } = await import("@/lib/ai-usage");
    await incrementAIUsage(data.toolType, user.id).catch((err) => {
      console.error("Failed to track AI usage:", err);
    });
  } catch (error) {
    // Silently fail - history tracking shouldn't break the main flow
    console.error("Failed to save AI toolbox history:", error);
  }
}

export async function getAIToolboxHistory(
  toolType?: string,
  limit: number = 50
): Promise<any[]> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    const where: any = { userId: user.id };
    if (toolType) {
      where.toolType = toolType;
    }

    const history = await prisma.aIToolboxHistory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return history;
  } catch (error) {
    console.error("Failed to fetch AI toolbox history:", error);
    return [];
  }
}


