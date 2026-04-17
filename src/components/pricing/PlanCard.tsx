"use strict";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CheckoutButton from "@/components/pricing/CheckoutButton";
import { Check, Infinity as LucideInfinity, Zap } from "lucide-react";
import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";

interface PlanCardProps {
  planKey: SubscriptionPlan;
  plan: SubscriptionPlanConfig;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
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
        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isPopular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
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

function PlanCardFooter({
  isCurrentPlan,
  planKey,
  planName,
  isPopular,
}: {
  isCurrentPlan: boolean;
  planKey: SubscriptionPlan;
  planName: string;
  isPopular: boolean;
}) {
  if (isCurrentPlan) {
    return (
      <Link href="/dashboard/billing" className="w-full">
        <Button className="w-full h-12 text-base font-semibold" variant="default">
          View Usage & Billing
        </Button>
      </Link>
    );
  }

  return (
    <CheckoutButton
      planId={planKey}
      planName={planName}
      className={`w-full h-12 text-base font-semibold transition-all ${isPopular
        ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
        : "bg-secondary hover:bg-secondary/80 text-white"
        }`}
      variant={isPopular ? "default" : "secondary"}
    />
  );
}

export function PlanCard({ planKey, plan, isPopular = false, isCurrentPlan = false }: PlanCardProps) {
  return (
    <Card
      className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${isPopular
        ? "border-2 border-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/5 to-background"
        : "border hover:border-primary/50 hover:shadow-lg"
        } ${isCurrentPlan ? "ring-2 ring-primary/20" : ""}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg px-4 py-1.5 text-sm font-semibold">
            <Zap className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="text-xs">
            Current
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
        <PlanCardFooter
          isCurrentPlan={isCurrentPlan}
          planKey={planKey}
          planName={plan.name}
          isPopular={isPopular}
        />
      </CardFooter>
    </Card>
  );
}
















