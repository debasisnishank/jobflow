"use client";

import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CheckoutButton from "@/components/pricing/CheckoutButton";
import { Check, Infinity as LucideInfinity, Zap, Briefcase, FileText, Sparkles, HardDrive, Loader2 } from "lucide-react";
import { SectionContainer } from "@/components/common/SectionContainer";
import { useEffect, useState } from "react";

interface PlanCardProps {
  planKey: SubscriptionPlan;
  plan: SubscriptionPlanConfig;
  isPopular?: boolean;
}

function PlanPrice({ price }: { price: number }) {
  if (price === 0) {
    return (
      <div>
        <span className="text-5xl font-extrabold text-foreground">Free</span>
        <p className="text-sm text-muted-foreground mt-1">Forever</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl font-extrabold text-foreground">${price}</span>
        <span className="text-lg text-muted-foreground">/month</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Billed monthly</p>
    </div>
  );
}

function PlanFeatureItem({
  label,
  value,
  isPopular,
}: {
  label: string;
  value: number | string;
  isPopular: boolean;
}) {
  const displayValue =
    value === -1 ? (
      <span className="flex items-center gap-1">
        <LucideInfinity className="h-4 w-4" />
        Unlimited
      </span>
    ) : typeof value === "number" ? (
      value.toLocaleString()
    ) : (
      value
    );

  return (
    <li className="flex items-center gap-3">
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
          isPopular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1">
        <span className="font-semibold text-base">
          {displayValue} <span className="font-normal text-muted-foreground">{label}</span>
        </span>
      </div>
    </li>
  );
}

function PlanFeaturesList({
  limits,
  isPopular,
}: {
  limits: {
    jobs: number;
    resumes: number;
    aiRequestsPerMonth: number;
    storageMB: number;
  };
  isPopular: boolean;
}) {
  return (
    <ul className="space-y-4">
      <PlanFeatureItem label="Jobs Applied" value={limits.jobs} isPopular={isPopular} />
      <PlanFeatureItem label="Resumes" value={limits.resumes} isPopular={isPopular} />
      <PlanFeatureItem
        label="AI Requests"
        value={limits.aiRequestsPerMonth}
        isPopular={isPopular}
      />
      <PlanFeatureItem label="Storage" value={`${limits.storageMB} MB`} isPopular={isPopular} />
    </ul>
  );
}

function LandingPlanCard({ planKey, plan, isPopular = false }: PlanCardProps) {
  return (
    <Card
      className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${
        isPopular
          ? "border-2 border-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/10 via-primary/5 to-background"
          : "border hover:border-primary/50 hover:shadow-lg"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground shadow-lg px-4 py-1.5 text-sm font-semibold">
            <Zap className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-6 pt-8">
        <CardTitle className="text-3xl font-bold mb-2">{plan.name}</CardTitle>
        <div className="mt-4">
          <PlanPrice price={plan.price} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-6">
        <PlanFeaturesList limits={plan.limits} isPopular={isPopular} />
      </CardContent>
      <CardFooter className="pt-6 pb-8 px-6">
        {plan.price === 0 ? (
          <Link href="/signup" className="w-full">
            <Button className="w-full h-12 text-base font-semibold" variant="outline">
              Get Started Free
            </Button>
          </Link>
        ) : (
          <CheckoutButton
            planId={planKey}
            planName={plan.name}
            className={`w-full h-12 text-base font-semibold transition-all ${
              isPopular
                ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            variant={isPopular ? "default" : "secondary"}
          />
        )}
      </CardFooter>
    </Card>
  );
}

export function PricingSection() {
  const [plans, setPlans] = useState<[SubscriptionPlan, SubscriptionPlanConfig][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        const data = await response.json();
        if (data.success && data.plans) {
          const plansArray = Object.entries(data.plans) as [SubscriptionPlan, SubscriptionPlanConfig][];
          setPlans(plansArray);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <SectionContainer id="pricing" background="white" padding="lg" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="pricing" background="white" padding="lg" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center justify-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Pricing Plans
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text-primary">
            Choose Your Plan
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select the perfect plan for your job search journey. All plans include
            our core features with varying limits to suit your needs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {plans.map(([planKey, plan], index) => (
            <LandingPlanCard
              key={planKey}
              planKey={planKey}
              plan={plan}
              isPopular={index === 1}
            />
          ))}
        </div>

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
    </SectionContainer>
  );
}

