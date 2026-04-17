"use client";

import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CheckoutButton from "@/components/pricing/CheckoutButton";
import { Check, Zap, Briefcase, FileText, Sparkles, HardDrive, ArrowRight, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { appConfig } from "@/lib/config/app.config";
import Link from "next/link";
import { useAppConfigContext } from "@/contexts/AppConfigContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PlanCardProps {
  planKey: SubscriptionPlan;
  plan: SubscriptionPlanConfig;
  isPopular?: boolean;
}

function PlanPrice({ price }: { price: number }) {
  if (price === 0) {
    return (
      <div>
        <span className="text-5xl font-extrabold text-gray-900">Free</span>
        <p className="text-sm text-gray-600 mt-1">Forever</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl font-extrabold text-gray-900">${price}</span>
        <span className="text-lg text-gray-600">/month</span>
      </div>
      <p className="text-xs text-gray-600 mt-1">Billed monthly</p>
    </div>
  );
}

function formatValue(value: number): string {
  if (value === -1) return "Unlimited";
  if (value === 0) return "Not Available";
  return value.toString();
}

function PlanFeatureItem({
  label,
  value,
  isPopular,
}: {
  label: string;
  value: string | number | boolean;
  isPopular?: boolean;
}) {
      if (typeof value === "boolean") {
    return (
      <div className="flex items-center gap-2">
        {value ? (
          <Check className="h-5 w-5 text-[#3B82F6] flex-shrink-0" />
        ) : (
          <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
        )}
        <span className={`text-sm ${value ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${isPopular ? "text-[#3B82F6]" : "text-gray-900"}`}>
        {typeof value === "number" ? formatValue(value) : value}
      </span>
    </div>
  );
}

function LandingPlanCard({ planKey, plan, isPopular = false }: PlanCardProps) {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const coreFeatures = [
    { label: "Job Applications", value: plan.limits.jobs },
    { label: "Resumes", value: plan.limits.resumes },
    { label: "Storage", value: plan.limits.storageMB === -1 ? "Unlimited" : `${plan.limits.storageMB} MB` },
    { label: "Team Members", value: plan.limits.teamMembers },
  ];

  const aiToolboxFeatures = [
    { label: "Personal Brand Statement", value: plan.limits.aiToolboxPersonalBrand },
    { label: "Email Writer", value: plan.limits.aiToolboxEmailWriter },
    { label: "Elevator Pitch", value: plan.limits.aiToolboxElevatorPitch },
    { label: "LinkedIn Headline", value: plan.limits.aiToolboxLinkedInHeadline },
    { label: "LinkedIn About", value: plan.limits.aiToolboxLinkedInAbout },
    { label: "LinkedIn Post", value: plan.limits.aiToolboxLinkedInPost },
  ];

  const aiResumeFeatures = [
    { label: "Resume Review", value: plan.limits.aiResumeReview },
    { label: "Job Matching", value: plan.limits.aiJobMatching },
    { label: "Cover Letter Generation", value: plan.limits.aiCoverLetter },
  ];

  const interviewFeatures = [
    { label: "Mock Interviews", value: plan.limits.mockInterviews },
  ];

  const supportFeatures = [
    { label: "Email Support", value: true },
    { label: "Priority Support", value: planKey === "experience" },
    { label: "Dedicated Account Manager", value: planKey === "experience" },
  ];

  return (
    <Card
      className={`relative h-full flex flex-col ${
        isPopular
          ? "border-2 border-[#3B82F6] shadow-xl scale-105"
          : "border border-gray-200 hover:shadow-lg transition-shadow"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#3B82F6] text-white px-4 py-1 text-sm font-semibold">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
        <div className="mb-6">
          <PlanPrice price={plan.price} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Core Features */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Core Features</h4>
          <div className="space-y-2">
            {coreFeatures.map((feature, idx) => (
              <PlanFeatureItem
                key={idx}
                label={feature.label}
                value={feature.value}
                isPopular={isPopular}
              />
            ))}
          </div>
        </div>

        {/* AI Toolbox - Monthly Limits */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            AI Toolbox <span className="text-[10px] font-normal">(per month)</span>
          </h4>
          <div className="space-y-2">
            {aiToolboxFeatures.slice(0, showAllFeatures ? undefined : 3).map((feature, idx) => (
              <PlanFeatureItem
                key={idx}
                label={feature.label}
                value={feature.value}
                isPopular={isPopular}
              />
            ))}
            {!showAllFeatures && aiToolboxFeatures.length > 3 && (
              <button
                onClick={() => setShowAllFeatures(true)}
                className="text-xs text-[#3B82F6] hover:underline font-medium w-full text-left"
              >
                + {aiToolboxFeatures.length - 3} more tools...
              </button>
            )}
            {showAllFeatures && (
              <button
                onClick={() => setShowAllFeatures(false)}
                className="text-xs text-gray-500 hover:underline font-medium w-full text-left"
              >
                Show less
              </button>
            )}
          </div>
        </div>

        {/* AI Resume Features */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            AI Resume <span className="text-[10px] font-normal">(per month)</span>
          </h4>
          <div className="space-y-2">
            {aiResumeFeatures.map((feature, idx) => (
              <PlanFeatureItem
                key={idx}
                label={feature.label}
                value={feature.value}
                isPopular={isPopular}
              />
            ))}
          </div>
        </div>

        {/* Interview Features */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Interviews <span className="text-[10px] font-normal">(per month)</span>
          </h4>
          <div className="space-y-2">
            {interviewFeatures.map((feature, idx) => (
              <PlanFeatureItem
                key={idx}
                label={feature.label}
                value={feature.value}
                isPopular={isPopular}
              />
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Support</h4>
          <div className="space-y-2">
            {supportFeatures.map((feature, idx) => (
              <PlanFeatureItem
                key={idx}
                label={feature.label}
                value={feature.value}
                isPopular={isPopular}
              />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <CheckoutButton planId={planKey} planName={plan.name} className="w-full" />
      </CardFooter>
    </Card>
  );
}

export function PricingPageContent() {
  const { config } = useAppConfigContext();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [plans, setPlans] = useState<Record<SubscriptionPlan, SubscriptionPlanConfig> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !plans) return;

    const ctx = gsap.context(() => {
      const headerChildren = headerRef.current?.children;
      const cardChildren = cardsRef.current?.children;

      if (headerChildren && headerChildren.length > 0) {
        gsap.fromTo(headerChildren,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
          }
        );
      }

      if (cardChildren && cardChildren.length > 0) {
        gsap.fromTo(cardChildren,
          { y: 60, opacity: 0 },
          {
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [plans]);

  return (
    <div ref={sectionRef} className="w-full">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Simple Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Choose the Perfect Plan
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              For Your Job Search
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Flexible pricing options designed to help you succeed in your career journey. Start free, upgrade when you're ready.
          </p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="w-full bg-white py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div ref={headerRef} className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pricing Plans
            </h2>
            <p className="text-lg text-gray-600">
              Select the plan that best fits your needs
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : plans ? (
            <div ref={cardsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {Object.entries(plans).map(([key, plan], index) => (
                <LandingPlanCard
                  key={key}
                  planKey={key as SubscriptionPlan}
                  plan={plan}
                  isPopular={key === "freshers"}
                />
              ))}
            </div>
          ) : null}

          <div className="text-center mt-12">
            <p className="text-sm text-gray-600 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full bg-gray-50 py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Have questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards and debit cards through our secure payment processor.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! All paid plans come with a 14-day free trial. No credit card required to start.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/faq">
              <Button variant="outline" className="gap-2">
                View All FAQs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Join thousands of job seekers who are using {config.brandName} to land their dream jobs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md h-11 px-8 text-base font-semibold bg-white text-[#3B82F6] hover:bg-gray-100 shadow-lg transition-all duration-200">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 text-[#3B82F6]" />
              </button>
            </Link>
            <Link href="/features">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#3B82F6] px-8 font-semibold">
                View Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

