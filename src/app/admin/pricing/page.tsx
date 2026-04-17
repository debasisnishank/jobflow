import { PricingPlansTable } from "@/components/admin/pricing/PricingPlansTable";
import { getCurrentUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pricing Plans</h1>
        <p className="text-muted-foreground">
          Manage subscription plans and feature limits
        </p>
      </div>
      <PricingPlansTable />
    </div>
  );
}
