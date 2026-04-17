import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import Link from "next/link";
import { getBillingInfo } from "@/actions/billing.actions";
import { PlanCard } from "@/components/pricing/PlanCard";
import { getSubscriptionPlans } from "@/lib/admin/plans.service";
import {
  Briefcase,
  FileText,
  Sparkles,
  HardDrive,
  CreditCard,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing Plans",
};

export default async function PricingPage(): Promise<JSX.Element> {
  const plansData = await getSubscriptionPlans();
  const planOrder: SubscriptionPlan[] = ["free", "freshers", "experience"];

  const plans = planOrder
    .map((key) => {
      const plan = plansData[key];
      return plan ? [key, plan] : null;
    })
    .filter((entry): entry is [SubscriptionPlan, SubscriptionPlanConfig] => entry !== null);

  // Get current plan info (defaults to "free" for now)
  let currentPlanKey: SubscriptionPlan = "free";
  try {
    const billingInfo = await getBillingInfo();
    currentPlanKey = billingInfo.planInfo.currentPlan;
  } catch {
    // If billing info fails, default to free
    currentPlanKey = "free";
  }

  return (
    <div className="flex flex-col col-span-3 space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            Pricing Plans
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Select the perfect plan for your job search journey. All plans include
          our core features with varying limits to suit your needs.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto w-full">
        {plans.map(([planKey, plan], index) => (
          <PlanCard
            key={planKey}
            planKey={planKey}
            plan={plan}
            isPopular={index === 1} // Freshers plan is popular
            isCurrentPlan={planKey === currentPlanKey}
          />
        ))}
      </div>

      {/* Features Comparison */}
      <div className="max-w-5xl mx-auto w-full">
        <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold mb-2">
              All Plans Include
            </CardTitle>
            <CardDescription className="text-base">
              Every plan comes with these powerful features included
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold mb-1">Job Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Track all your applications
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold mb-1">Resume Builder</p>
                <p className="text-sm text-muted-foreground">
                  Create multiple resumes
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold mb-1">AI Assistance</p>
                <p className="text-sm text-muted-foreground">
                  Resume reviews & job matching
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <HardDrive className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold mb-1">File Storage</p>
                <p className="text-sm text-muted-foreground">
                  Secure document storage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Usage Link */}
      <div className="text-center pt-4">
        <Link href="/dashboard/billing">
          <Button variant="outline" className="gap-2 h-11 px-6" size="lg">
            <CreditCard className="h-4 w-4" />
            View Current Usage & Billing Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

