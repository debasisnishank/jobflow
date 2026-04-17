"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";

interface PlanDetailViewProps {
  planKey: SubscriptionPlan;
  plan: SubscriptionPlanConfig;
}

export default function PlanDetailView({ planKey, plan: initialPlan }: PlanDetailViewProps) {
  const [plan, setPlan] = useState<SubscriptionPlanConfig>(initialPlan);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await fetch(`/api/admin/plans/${planKey}`);
        if (response.ok) {
          const planData = await response.json();
          setPlan(planData);
        }
      } catch (error) {
        console.error("Error fetching plan data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [planKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  const formatLimit = (value: number, suffix: string = "") => {
    if (value === -1) return "Unlimited";
    return `${value}${suffix}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pricing">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{plan.name} Plan</h1>
            <p className="text-muted-foreground">
              Detailed view of plan configuration and feature limits
            </p>
          </div>
        </div>
        <Link href={`/admin/pricing/${planKey}?edit=true`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Plan
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Information</CardTitle>
            <CardDescription>Basic plan details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Plan Name</label>
              <p className="text-lg font-semibold">{plan.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Price</label>
              <p className="text-lg font-semibold">
                {plan.price === 0 ? (
                  <Badge variant="secondary">Free</Badge>
                ) : (
                  `$${plan.price.toFixed(2)}/month`
                )}
              </p>
            </div>
            {plan.razorpayPlanId && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Razorpay Plan ID</label>
                <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{plan.razorpayPlanId}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Plan Key</label>
              <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{planKey}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Features</CardTitle>
            <CardDescription>Basic feature limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Jobs</span>
              <Badge variant="outline">{formatLimit(plan.limits.jobs)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Resumes</span>
              <Badge variant="outline">{formatLimit(plan.limits.resumes)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Storage</span>
              <Badge variant="outline">{formatLimit(plan.limits.storageMB, "MB")}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Team Members</span>
              <Badge variant="outline">{formatLimit(plan.limits.teamMembers)}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Toolbox Features</CardTitle>
            <CardDescription>Monthly limits for AI toolbox tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Personal Brand Statement</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiToolboxPersonalBrand)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Email Writer</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiToolboxEmailWriter)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Elevator Pitch</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiToolboxElevatorPitch)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">LinkedIn Headline</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiToolboxLinkedInHeadline)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">LinkedIn About</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiToolboxLinkedInAbout)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">LinkedIn Post</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiToolboxLinkedInPost)}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Resume Features</CardTitle>
            <CardDescription>Monthly limits for AI resume tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Resume Review</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiResumeReview)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Job Matching</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiJobMatching)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cover Letter</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiCoverLetter)}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Features</CardTitle>
            <CardDescription>Additional feature limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Mock Interviews</span>
              <Badge variant="outline">
                {plan.limits.mockInterviews === 0 ? "Not Available" : formatLimit(plan.limits.mockInterviews)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total AI Requests/Month</span>
              <Badge variant="outline">{formatLimit(plan.limits.aiRequestsPerMonth)}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
