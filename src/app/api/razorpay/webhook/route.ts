"use strict";

import "server-only";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  handlePaymentCaptured,
  handleSubscriptionActivated,
  handleSubscriptionUpdated,
  handleSubscriptionCancelled,
  RazorpayPaymentPayload,
  RazorpaySubscriptionPayload,
} from "./handlers";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("RAZORPAY_WEBHOOK_SECRET is not set in environment variables");
}

function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret!)
    .update(rawBody)
    .digest("hex");

  return signature === expectedSignature;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    let payload: { event: string; payload: Record<string, unknown> };
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const event = payload.event;

    switch (event) {
      case "payment.captured": {
        await handlePaymentCaptured(payload as unknown as RazorpayPaymentPayload);
        break;
      }

      case "subscription.activated": {
        await handleSubscriptionActivated(payload as unknown as RazorpaySubscriptionPayload);
        break;
      }

      case "subscription.updated": {
        await handleSubscriptionUpdated(payload as unknown as RazorpaySubscriptionPayload);
        break;
      }

      case "subscription.cancelled": {
        await handleSubscriptionCancelled(payload as unknown as RazorpaySubscriptionPayload);
        break;
      }

      case "subscription.paused": {
        // Treat pause as downgrade to free
        await handleSubscriptionUpdated(payload as unknown as RazorpaySubscriptionPayload);
        break;
      }

      default:
        // Unhandled event type - silently ignored
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
