"use strict";

import "server-only";

import Razorpay from "razorpay";
import { DatabaseError } from "@/lib/errors";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { getSubscriptionPlans } from "@/lib/admin/plans.service";

let razorpay: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables");
    }

    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpay;
}

export { razorpay };

export interface CreateOrderParams {
  userId: string;
  userEmail: string;
  planId: SubscriptionPlan;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
  notes: Record<string, string>;
}

export interface CreateCustomerParams {
  userId: string;
  email: string;
  name: string;
}

export async function createRazorpayCustomer(params: CreateCustomerParams): Promise<string> {
  const instance = getRazorpayInstance();

  try {
    const customer = await instance.customers.create({
      email: params.email,
      name: params.name,
      fail_existing: 0,
      notes: {
        userId: params.userId,
      },
    });

    return customer.id;
  } catch (error) {
    throw new DatabaseError("Failed to create Razorpay customer", {
      context: { email: params.email, userId: params.userId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function getCustomerByEmail(email: string): Promise<string | null> {
  const instance = getRazorpayInstance();

  try {
    const customers = (await instance.customers.all({
      count: 100,
    })) as { items?: Array<{ id: string; email?: string }> };

    const matchingCustomer = customers.items?.find(
      (customer) => customer.email?.toLowerCase() === email.toLowerCase()
    );

    if (matchingCustomer) {
      return matchingCustomer.id;
    }

    return null;
  } catch (error) {
    // If customer not found, return null
    return null;
  }
}

export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name: string
): Promise<string> {
  // Try to find existing customer
  const existingCustomerId = await getCustomerByEmail(email);
  if (existingCustomerId) {
    return existingCustomerId;
  }

  // Create new customer
  return createRazorpayCustomer({ userId, email, name });
}

export async function createOrder(
  params: CreateOrderParams
): Promise<{ orderId: string; amount: number; currency: string }> {
  const instance = getRazorpayInstance();

  try {
    const allPlans = await getSubscriptionPlans();
    const planConfig = allPlans[params.planId];

    if (!planConfig) {
      throw new Error(`Plan configuration not found for plan: ${params.planId}`);
    }

    const razorpayPlanId = planConfig.razorpayPlanId;

    if (!razorpayPlanId && params.planId !== "free") {
      throw new Error(
        `Razorpay Plan ID not configured for plan: ${params.planId}. Please configure it in the admin panel.`
      );
    }

    // For free plan, no order needed
    if (params.planId === "free") {
      throw new Error("Free plan does not require checkout");
    }

    // Amount in paise (Razorpay uses paisa as base unit)
    // Price is in USD, convert to INR (or use currency conversion)
    // For simplicity, we assume price is already in INR (smallest currency unit)
    // If using INR, amount = price * 100 (paise)
    // If using USD, amount = price * 100 (cents) but Razorpay only supports INR
    // For demo: assuming price is in INR
    const amountInPaise = Math.round(planConfig.price * 100);

    // Get or create customer
    const customerId = await getOrCreateCustomer(
      params.userId,
      params.userEmail,
      params.userEmail.split("@")[0]
    );

    // Create order
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${params.userId}_${params.planId}_${Date.now()}`,
      notes: {
        userId: params.userId,
        planId: params.planId,
        customerId,
      },
    });

    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError("Failed to create Razorpay order", {
      context: { planId: params.planId, userId: params.userId },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not set");
  }

  const crypto = await import("crypto");

  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  return signature === expectedSignature;
}
