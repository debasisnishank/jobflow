"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { SubscriptionPlan, SubscriptionPlanConfig } from "@/lib/subscription-plans";

interface PlanEditorProps {
  planKey: SubscriptionPlan;
  plan: SubscriptionPlanConfig;
  onSave?: () => void;
  onCancel?: () => void;
}

export function PlanEditor({ planKey, plan, onSave, onCancel }: PlanEditorProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const initializeFormData = (planData: SubscriptionPlanConfig) => ({
    name: planData.name,
    price: planData.price,
    razorpayPlanId: planData.razorpayPlanId ?? "",
    limits: { ...planData.limits },
  });

  const [formData, setFormData] = useState(initializeFormData(plan));
  const [originalData, setOriginalData] = useState(initializeFormData(plan));

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await fetch(`/api/admin/plans/${planKey}`);
        if (response.ok) {
          const currentPlan = await response.json();
          if (currentPlan) {
            const fetchedData = initializeFormData(currentPlan);
            setFormData(fetchedData);
            setOriginalData(fetchedData);
          }
        } else {
          throw new Error("Failed to fetch plan");
        }
      } catch (error) {
        console.error("Error fetching plan data:", error);
        const defaultData = initializeFormData(plan);
        setFormData(defaultData);
        setOriginalData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [planKey, plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!originalData) {
        throw new Error("Original data not loaded");
      }

      const payload: any = { planKey };

      if (formData.name !== originalData.name) {
        payload.name = formData.name;
      }
      if (formData.price !== originalData.price) {
        payload.price = formData.price;
      }
      if (formData.razorpayPlanId !== originalData.razorpayPlanId) {
        payload.razorpayPlanId = formData.razorpayPlanId || null;
      }

      const changedLimits: any = {};
      let hasChangedLimits = false;
      
      Object.keys(formData.limits).forEach((key) => {
        const limitKey = key as keyof typeof formData.limits;
        if (formData.limits[limitKey] !== originalData.limits[limitKey]) {
          changedLimits[limitKey] = formData.limits[limitKey];
          hasChangedLimits = true;
        }
      });

      if (hasChangedLimits) {
        payload.limits = changedLimits;
      }

      const response = await fetch("/api/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Plan updated successfully",
          variant: "success",
        });
        if (onSave) {
          onSave();
        }
        setTimeout(() => {
          router.push(`/admin/pricing/${planKey}`);
        }, 1000);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update plan");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update plan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit {formData.name} Plan</CardTitle>
          <CardDescription>Update plan details and feature limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="razorpayPlanId">Razorpay Plan ID</Label>
            <Input
              id="razorpayPlanId"
              type="text"
              value={formData.razorpayPlanId || ""}
              onChange={(e) => setFormData({ ...formData, razorpayPlanId: e.target.value })}
              placeholder="plan_xxxxx"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Core Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobs">Jobs (-1 for unlimited)</Label>
                  <Input
                    id="jobs"
                    type="number"
                    value={formData.limits.jobs}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, jobs: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resumes">Resumes (-1 for unlimited)</Label>
                  <Input
                    id="resumes"
                    type="number"
                    value={formData.limits.resumes}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, resumes: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageMB">Storage (MB, -1 for unlimited)</Label>
                  <Input
                    id="storageMB"
                    type="number"
                    value={formData.limits.storageMB}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, storageMB: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamMembers">Team Members (-1 for unlimited)</Label>
                  <Input
                    id="teamMembers"
                    type="number"
                    value={formData.limits.teamMembers}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, teamMembers: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">AI Toolbox Features (Monthly)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aiToolboxPersonalBrand">Personal Brand Statement (-1 for unlimited)</Label>
                  <Input
                    id="aiToolboxPersonalBrand"
                    type="number"
                    value={formData.limits.aiToolboxPersonalBrand}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiToolboxPersonalBrand: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiToolboxEmailWriter">Email Writer (-1 for unlimited)</Label>
                  <Input
                    id="aiToolboxEmailWriter"
                    type="number"
                    value={formData.limits.aiToolboxEmailWriter}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiToolboxEmailWriter: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiToolboxElevatorPitch">Elevator Pitch (-1 for unlimited)</Label>
                  <Input
                    id="aiToolboxElevatorPitch"
                    type="number"
                    value={formData.limits.aiToolboxElevatorPitch}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiToolboxElevatorPitch: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiToolboxLinkedInHeadline">LinkedIn Headline (-1 for unlimited)</Label>
                  <Input
                    id="aiToolboxLinkedInHeadline"
                    type="number"
                    value={formData.limits.aiToolboxLinkedInHeadline}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiToolboxLinkedInHeadline: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiToolboxLinkedInAbout">LinkedIn About (-1 for unlimited)</Label>
                  <Input
                    id="aiToolboxLinkedInAbout"
                    type="number"
                    value={formData.limits.aiToolboxLinkedInAbout}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiToolboxLinkedInAbout: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiToolboxLinkedInPost">LinkedIn Post (-1 for unlimited)</Label>
                  <Input
                    id="aiToolboxLinkedInPost"
                    type="number"
                    value={formData.limits.aiToolboxLinkedInPost}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiToolboxLinkedInPost: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">AI Resume Features (Monthly)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aiResumeReview">Resume Review (-1 for unlimited)</Label>
                  <Input
                    id="aiResumeReview"
                    type="number"
                    value={formData.limits.aiResumeReview}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiResumeReview: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiJobMatching">Job Matching (-1 for unlimited)</Label>
                  <Input
                    id="aiJobMatching"
                    type="number"
                    value={formData.limits.aiJobMatching}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiJobMatching: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiCoverLetter">Cover Letter (-1 for unlimited)</Label>
                  <Input
                    id="aiCoverLetter"
                    type="number"
                    value={formData.limits.aiCoverLetter}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiCoverLetter: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Other Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mockInterviews">Mock Interviews (-1 for unlimited, 0 for not available)</Label>
                  <Input
                    id="mockInterviews"
                    type="number"
                    value={formData.limits.mockInterviews}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, mockInterviews: parseInt(e.target.value) || 0 },
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiRequestsPerMonth">Total AI Requests/Month (-1 for unlimited)</Label>
                  <Input
                    id="aiRequestsPerMonth"
                    type="number"
                    value={formData.limits.aiRequestsPerMonth}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: { ...formData.limits, aiRequestsPerMonth: parseInt(e.target.value) || -1 },
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
            router.push(`/admin/pricing/${planKey}`);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
