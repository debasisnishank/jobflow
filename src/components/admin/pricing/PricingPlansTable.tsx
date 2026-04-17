"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Edit, Eye, Database, RefreshCw } from "lucide-react";
import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";
import Link from "next/link";

export function PricingPlansTable() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [plans, setPlans] = useState<Record<SubscriptionPlan, SubscriptionPlanConfig> | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/admin/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
        if (!data || Object.keys(data).length === 0) {
          toast({
            title: "No Pricing Plans Found",
            description: "Click 'Seed Default Plans' to initialize pricing plans.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pricing plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedPlans = async () => {
    try {
      setSeeding(true);
      const response = await fetch("/api/admin/plans/seed", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Seeded ${result.created} pricing plan${result.created !== 1 ? "s" : ""}.`,
          variant: "success",
        });
        await fetchPlans();
      } else {
        throw new Error(result.error || "Failed to seed plans");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to seed pricing plans",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

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

  if (!plans || Object.keys(plans).length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Initialize Pricing Plans
          </CardTitle>
          <CardDescription>
            No pricing plans found. Click below to seed default pricing plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSeedPlans} disabled={seeding}>
            {seeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Default Plans
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSeedPlans}
            disabled={seeding}
          >
            {seeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Update Plans
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchPlans}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
      {plans && Object.entries(plans).map(([planKey, plan]) => (
        <Card key={planKey} className="flex flex-col">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>${plan.price}/month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-3 text-sm">
              <div className="font-semibold text-base pb-2 border-b">Core Features</div>
              <div><strong>Jobs:</strong> {formatLimit(plan.limits.jobs)}</div>
              <div><strong>Resumes:</strong> {formatLimit(plan.limits.resumes)}</div>
              <div><strong>Storage:</strong> {formatLimit(plan.limits.storageMB, "MB")}</div>
              <div><strong>Team Members:</strong> {formatLimit(plan.limits.teamMembers)}</div>
              
              <div className="font-semibold text-base pt-3 pb-2 border-b mt-3">AI Toolbox (Monthly)</div>
              <div><strong>Personal Brand Statement:</strong> {formatLimit(plan.limits.aiToolboxPersonalBrand)}</div>
              <div><strong>Email Writer:</strong> {formatLimit(plan.limits.aiToolboxEmailWriter)}</div>
              <div><strong>Elevator Pitch:</strong> {formatLimit(plan.limits.aiToolboxElevatorPitch)}</div>
              <div><strong>LinkedIn Headline:</strong> {formatLimit(plan.limits.aiToolboxLinkedInHeadline)}</div>
              <div><strong>LinkedIn About:</strong> {formatLimit(plan.limits.aiToolboxLinkedInAbout)}</div>
              <div><strong>LinkedIn Post:</strong> {formatLimit(plan.limits.aiToolboxLinkedInPost)}</div>
              
              <div className="font-semibold text-base pt-3 pb-2 border-b mt-3">AI Resume Features (Monthly)</div>
              <div><strong>Resume Review:</strong> {formatLimit(plan.limits.aiResumeReview)}</div>
              <div><strong>Job Matching:</strong> {formatLimit(plan.limits.aiJobMatching)}</div>
              <div><strong>Cover Letter:</strong> {formatLimit(plan.limits.aiCoverLetter)}</div>
              
              <div className="font-semibold text-base pt-3 pb-2 border-b mt-3">Other Features</div>
              <div><strong>Mock Interviews:</strong> {formatLimit(plan.limits.mockInterviews)}</div>
              <div><strong>Total AI Requests:</strong> {formatLimit(plan.limits.aiRequestsPerMonth)}</div>
            </div>
            <div className="pt-4 mt-auto flex gap-2">
              <Link href={`/admin/pricing/${planKey}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </Link>
              <Link href={`/admin/pricing/${planKey}?edit=true`} className="flex-1">
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
}
