"use strict";

import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/razorpay";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { getCurrentUser } from "@/utils/user.utils";
import { AuthenticationError, ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: "Online payment is disabled on this deployment" },
        { status: 503 }
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planId } = body as { planId: SubscriptionPlan };

    if (!planId || !["freshers", "experience"].includes(planId)) {
      throw new ValidationError("Invalid plan ID", {
        context: { planId },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/dashboard/billing?success=true&payment=completed`;
    const cancelUrl = `${baseUrl}/dashboard/pricing?canceled=true`;

    const order = await createOrder({
      userId: user.id,
      userEmail: user.email,
      planId,
    });

    return NextResponse.json({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId,
      userEmail: user.email,
      userName: user.name || user.email.split("@")[0],
      successUrl,
      cancelUrl,
      planId,
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to create order";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
