"use client";

import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CheckoutButton from "@/components/pricing/CheckoutButton";
import { Check, Infinity as LucideInfinity, Zap, Briefcase, FileText, Sparkles, HardDrive, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
          isPopular ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white" : "bg-gradient-to-br from-emerald-500/10 to-blue-500/10 text-gray-700"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1">
        <span className="font-semibold text-base text-gray-900">
          {displayValue} <span className="font-normal text-gray-600">{label}</span>
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
          ? "border-2 border-transparent bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-white shadow-2xl scale-105 ring-4 ring-emerald-500/20"
          : "border border-gray-200 hover:border-gray-300 hover:shadow-lg"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg px-4 py-1.5 text-sm font-semibold">
            <Zap className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-6 pt-8">
        <CardTitle className="text-3xl font-bold mb-2 text-gray-900">{plan.name}</CardTitle>
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
            <Button className="w-full h-12 text-base font-semibold border-2 border-gray-300 hover:bg-gray-50" variant="outline">
              Get Started Free
            </Button>
          </Link>
        ) : (
          <CheckoutButton
            planId={planKey}
            planName={plan.name}
            className={`w-full h-12 text-base font-semibold transition-all ${
              isPopular
                ? "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
            variant={isPopular ? "default" : "default"}
          />
        )}
      </CardFooter>
    </Card>
  );
}

export function LandingPricing() {
  const [plans, setPlans] = useState<Record<SubscriptionPlan, SubscriptionPlanConfig> | null>(null);
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

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
            stagger: 0.15,
            ease: "power3.out"
          }
        );
      }

      if (cardChildren && cardChildren.length > 0) {
        gsap.fromTo(cardChildren,
          { y: 80, opacity: 0 },
          {
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.2)"
          }
        );
      }

      if (featuresRef.current) {
        gsap.fromTo(featuresRef.current,
          { y: 60, opacity: 0 },
          {
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [plans]);

  return (
    <section ref={sectionRef} id="pricing" className="w-full pt-20 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-white to-gray-50 scroll-mt-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div ref={headerRef} className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 bg-gray-100 text-gray-700">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="gradient-text-green-blue">Choose Your Plan</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Select the perfect plan for your job search journey. All plans include
            our core features with varying limits to suit your needs.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : plans ? (
          <div ref={cardsRef} className="grid gap-8 md:grid-cols-3 mb-16">
            {Object.entries(plans).map(([planKey, plan], index) => (
              <LandingPlanCard
                key={planKey}
                planKey={planKey as SubscriptionPlan}
                plan={plan}
                isPopular={index === 1}
              />
            ))}
          </div>
        ) : null}

        <Card ref={featuresRef} className="border-2 border-gray-200 bg-white shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold mb-2 text-gray-900">
              All Plans Include
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Every plan comes with these powerful features included
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-3">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold mb-1 text-gray-900">Job Tracking</p>
                <p className="text-sm text-gray-600">
                  Track all your applications
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold mb-1 text-gray-900">Resume Builder</p>
                <p className="text-sm text-gray-600">
                  Create multiple resumes
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold mb-1 text-gray-900">AI Assistance</p>
                <p className="text-sm text-gray-600">
                  Resume reviews & job matching
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-3">
                  <HardDrive className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold mb-1 text-gray-900">File Storage</p>
                <p className="text-sm text-gray-600">
                  Secure document storage
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-6 pb-8 flex justify-center border-t border-gray-100">
            <Link href="/pricing">
              <Button size="lg" className="gap-2 h-12 px-8 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                View Detailed Plans & Features
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
