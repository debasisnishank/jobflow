"use strict";

import "server-only";

import prisma from "@/lib/db";
import { SubscriptionPlan } from "@/lib/subscription-plans";

export async function handlePaymentCaptured(
  payload: RazorpayPaymentPayload
): Promise<void> {
  const { payload: paymentData, payload: { notes } } = payload;
  const userId = notes?.userId;
  const planId = notes?.planId as SubscriptionPlan | undefined;
  const customerId = notes?.customerId;

  if (!userId || !planId) {
    return;
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: planId,
        razorpayCustomerId: customerId || null,
      },
    });
  } catch (dbError) {
    // Database error handled silently - webhook should not expose internal errors
  }
}

export async function handleSubscriptionActivated(
  payload: RazorpaySubscriptionPayload
): Promise<void> {
  const { payload: subData } = payload;
  const userId = subData.notes?.userId as string | undefined;
  const planId = subData.notes?.planId as SubscriptionPlan | undefined;
  const customerId = subData.customer_id as string | undefined;

  if (!userId || !planId) {
    return;
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: planId,
        razorpayCustomerId: customerId || null,
        razorpaySubscriptionId: subData.id,
      },
    });
  } catch (dbError) {
    // Database error handled silently - webhook should not expose internal errors
  }
}

export async function handleSubscriptionUpdated(
  payload: RazorpaySubscriptionPayload
): Promise<void> {
  const { payload: subData } = payload;
  const planId = subData.notes?.planId as SubscriptionPlan | undefined;
  const customerId = subData.customer_id as string | undefined;

  if (!planId) {
    return;
  }

  try {
    const user = customerId
      ? await prisma.user.findFirst({
          where: { razorpayCustomerId: customerId },
        })
      : null;

    if (!user) {
      return;
    }

    if (subData.status === "active" || subData.status === "authenticated") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: planId,
          razorpaySubscriptionId: subData.id,
        },
      });
    } else if (
      subData.status === "cancelled" ||
      subData.status === "completed" ||
      subData.status === "paused"
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: "free",
          razorpaySubscriptionId: null,
        },
      });
    }
  } catch (dbError) {
    // Database error handled silently - webhook should not expose internal errors
  }
}

export async function handleSubscriptionCancelled(
  payload: RazorpaySubscriptionPayload
): Promise<void> {
  const { payload: subData } = payload;
  const customerId = subData.customer_id as string | undefined;

  if (!customerId) {
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { razorpayCustomerId: customerId },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: "free",
          razorpaySubscriptionId: null,
        },
      });
    }
  } catch (dbError) {
    // Database error handled silently - webhook should not expose internal errors
  }
}

// Type definitions for Razorpay webhook payloads
export interface RazorpayPaymentPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        invoice_id: string | null;
        international: boolean;
        method: string;
        amount_refunded: number;
        refund_status: string | null;
        captured: boolean;
        description: string | null;
        card_id: string;
        bank: string | null;
        wallet: string | null;
        vpa: string | null;
        email: string;
        contact: string;
        notes: Record<string, string>;
        fee: number;
        tax: number;
        error_code: string | null;
        error_description: string | null;
        created_at: number;
      };
    };
    order: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string;
        offer_id: string | null;
        status: string;
        attempts: number;
        created_at: number;
        notes: Record<string, string>;
      };
    };
  };
  created_at: number;
}

export interface RazorpaySubscriptionPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    subscription: {
      entity: {
        id: string;
        entity: string;
        plan_id: string;
        customer_id: string;
        status: string;
        current_start: number;
        current_end: number;
        charge_at: number;
        start_at: number;
        end_at: number;
        quantity: number;
        notes: Record<string, string>;
        notify_ids: string[];
        created_at: number;
        paused_at: number | null;
        auth_attempts: number;
        total_count: number;
        paid_count: number;
        remaining_count: number;
      };
    };
  };
  created_at: number;
}
