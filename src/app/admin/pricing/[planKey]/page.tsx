import { getCurrentUser } from "@/utils/user.utils";
import { redirect, notFound } from "next/navigation";
import { getSubscriptionPlanByKey } from "@/lib/admin/plans.service";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import PlanDetailView from "@/components/admin/pricing/PlanDetailView";
import { PlanEditor } from "@/components/admin/pricing/PlanEditor";

interface PlanDetailPageProps {
  params: Promise<{ planKey: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function PlanDetailPage({ params, searchParams }: PlanDetailPageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const { planKey } = await params;
  const { edit } = await searchParams;
  const isEditMode = edit === "true";

  if (!["free", "freshers", "experience"].includes(planKey)) {
    notFound();
  }

  const plan = await getSubscriptionPlanByKey(planKey as SubscriptionPlan);

  if (!plan) {
    notFound();
  }

  if (isEditMode) {
    return (
      <PlanEditor
        planKey={planKey as SubscriptionPlan}
        plan={plan}
      />
    );
  }

  return <PlanDetailView planKey={planKey as SubscriptionPlan} plan={plan} />;
}
