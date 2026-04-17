import "server-only";
import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";
import { getSubscriptionPlans } from "./plans.service";

export async function getSubscriptionPlansFromDB(): Promise<Record<SubscriptionPlan, SubscriptionPlanConfig>> {
  return getSubscriptionPlans();
}
