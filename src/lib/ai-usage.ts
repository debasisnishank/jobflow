import "server-only";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/utils/user.utils";

/**
 * Get the current usage period string (YYYY-MM)
 */
export function getCurrentPeriod(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

/**
 * Get current usage count for a specific feature
 */
export async function getTrackedAIUsage(
    type: string,
    userId?: string
): Promise<number> {
    const targetUserId = userId || (await getCurrentUser())?.id;
    if (!targetUserId) return 0;

    const currentPeriod = getCurrentPeriod();

    const usage = await prisma.aiUsage.findUnique({
        where: {
            userId_type_period: {
                userId: targetUserId,
                type,
                period: currentPeriod,
            },
        },
        select: { count: true },
    });

    return usage?.count || 0;
}

/**
 * Increment usage count for a specific feature
 */
export async function incrementAIUsage(
    type: string,
    userId?: string
): Promise<number> {
    const targetUserId = userId || (await getCurrentUser())?.id;
    if (!targetUserId) return 0;

    const currentPeriod = getCurrentPeriod();

    // Upsert to ensure record exists
    const usage = await prisma.aiUsage.upsert({
        where: {
            userId_type_period: {
                userId: targetUserId,
                type,
                period: currentPeriod,
            },
        },
        update: {
            count: { increment: 1 },
        },
        create: {
            userId: targetUserId,
            type,
            count: 1,
            period: currentPeriod,
            // limit could be passed in if we wanted to snapshot it, but fine for now
        },
        select: { count: true },
    });

    return usage.count;
}
