import { getBillingInfo } from "@/actions/billing.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Sparkles,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Users,
  Mail,
  Mic,
  MessageSquare,
  FileCheck,
  Target,
  FileEdit,
  Video,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Billing & Usage",
};

interface UsageCardProps {
  title: string;
  icon: React.ReactNode;
  used: number;
  limit: number | null; // null means unlimited
  unit?: string;
}

function UsageCard({ title, icon, used, limit, unit = "" }: UsageCardProps) {
  const isUnlimited = limit === null || limit === -1;
  const percentage = isUnlimited ? 0 : limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const remaining = isUnlimited ? null : Math.max(0, limit - used);
  const isNearLimit = !isUnlimited && remaining !== null && remaining < limit * 0.2;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {isNearLimit && remaining !== null && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Low
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{used.toLocaleString()}</span>
            {!isUnlimited && (
              <span className="text-sm text-muted-foreground">
                / {limit.toLocaleString()} {unit}
              </span>
            )}
            {isUnlimited && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                / ∞ {unit}
              </span>
            )}
          </div>
          {!isUnlimited && (
            <>
              <Progress value={percentage} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {remaining !== null
                    ? `${remaining.toLocaleString()} ${unit} remaining`
                    : "Limit reached"}
                </span>
                <span className="text-muted-foreground">{Math.round(percentage)}% used</span>
              </div>
            </>
          )}
          {isUnlimited && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>∞</span>
              <span>Unlimited</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function BillingPage(): Promise<JSX.Element> {
  const billingInfo = await getBillingInfo();
  const { planInfo, usage, remaining } = billingInfo;

  return (
    <div className="flex flex-col col-span-3 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold leading-none tracking-tight mb-2">
          Billing & Usage
        </h3>
        <p className="text-sm text-muted-foreground">
          View your current plan, usage statistics, and remaining limits
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription plan</CardDescription>
            </div>
            <Badge variant={planInfo.planPrice === 0 ? "secondary" : "default"} className="text-lg px-4 py-2">
              {planInfo.planName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            {planInfo.planPrice === 0 ? (
              <>
                <span className="text-3xl font-bold">Free</span>
                <span className="text-muted-foreground">forever</span>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold">${planInfo.planPrice}</span>
                <span className="text-muted-foreground">/month</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics Grid */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Core Usage Statistics</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <UsageCard
            title="Jobs Applied"
            icon={<Briefcase className="h-5 w-5 text-primary" />}
            used={usage.jobsCount}
            limit={planInfo.limits.jobs}
          />
          <UsageCard
            title="Resumes"
            icon={<FileText className="h-5 w-5 text-primary" />}
            used={usage.resumesCount}
            limit={planInfo.limits.resumes}
          />
          <UsageCard
            title="Total AI Requests"
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            used={usage.aiRequestsCount}
            limit={planInfo.limits.aiRequestsPerMonth}
            unit="this month"
          />
          <UsageCard
            title="Storage"
            icon={<HardDrive className="h-5 w-5 text-primary" />}
            used={usage.storageUsedMB}
            limit={planInfo.limits.storageMB}
            unit="MB"
          />
        </div>
      </div>

      {/* AI Toolbox Usage Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Toolbox Usage
          </CardTitle>
          <CardDescription>
            Monthly usage breakdown for all AI-powered career tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Personal Brand</span>
              </div>
              <Badge variant="secondary">{usage.aiToolboxPersonalBrand}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email Writer</span>
              </div>
              <Badge variant="secondary">{usage.aiToolboxEmailWriter}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Elevator Pitch</span>
              </div>
              <Badge variant="secondary">{usage.aiToolboxElevatorPitch}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">LinkedIn Headline</span>
              </div>
              <Badge variant="secondary">{usage.aiToolboxLinkedInHeadline}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">LinkedIn About</span>
              </div>
              <Badge variant="secondary">{usage.aiToolboxLinkedInAbout}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">LinkedIn Post</span>
              </div>
              <Badge variant="secondary">{usage.aiToolboxLinkedInPost}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Resume Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            AI Resume Features
          </CardTitle>
          <CardDescription>
            Monthly usage for AI-powered resume and job matching tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Resume Parsing</span>
              </div>
              <Badge variant="secondary">{usage.aiResumeParse}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <FileCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Resume Reviews</span>
              </div>
              <Badge variant="secondary">{usage.aiResumeReview}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Job Matching</span>
              </div>
              <Badge variant="secondary">{usage.aiJobMatching}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <FileEdit className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Cover Letters</span>
              </div>
              <Badge variant="secondary">{usage.aiCoverLetter}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Generate Bullets</span>
              </div>
              <Badge variant="secondary">{usage.aiGenerateBullets}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Generate Summary</span>
              </div>
              <Badge variant="secondary">{usage.aiGenerateSummary}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tailor Resume</span>
              </div>
              <Badge variant="secondary">{usage.aiTailorResume}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Interviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Mock Interviews
          </CardTitle>
          <CardDescription>
            Monthly mock interview sessions conducted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Total Sessions</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{usage.mockInterviews}</div>
              <div className="text-sm text-muted-foreground">this month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Storage Details
          </CardTitle>
          <CardDescription>
            File storage usage for resumes and documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div>
                <div className="font-medium">Current Usage</div>
                <div className="text-sm text-muted-foreground">Total storage consumed</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{usage.storageUsedMB.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">MB</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div>
                <div className="font-medium">Storage Limit</div>
                <div className="text-sm text-muted-foreground">Maximum allowed</div>
              </div>
              <div className="text-right">
                {planInfo.limits.storageMB === -1 ? (
                  <>
                    <div className="text-2xl font-bold">∞</div>
                    <div className="text-sm text-muted-foreground">Unlimited</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{planInfo.limits.storageMB.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">MB</div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <div className="font-medium text-primary">Remaining Storage</div>
                <div className="text-sm text-muted-foreground">Available space</div>
              </div>
              <div className="text-right">
                {remaining.storageMB === null ? (
                  <>
                    <div className="text-2xl font-bold text-primary">∞</div>
                    <div className="text-sm text-muted-foreground">Unlimited</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-primary">{remaining.storageMB.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">MB</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Limits Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Limits Summary</CardTitle>
          <CardDescription>
            Complete overview of your {planInfo.planName} plan limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Jobs Applied</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {planInfo.limits.jobs === -1 ? (
                  <span className="flex items-center gap-1">
                    ∞ Unlimited
                  </span>
                ) : (
                  `${planInfo.limits.jobs.toLocaleString()} jobs`
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Resumes</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {planInfo.limits.resumes === -1 ? (
                  <span className="flex items-center gap-1">
                    ∞ Unlimited
                  </span>
                ) : (
                  `${planInfo.limits.resumes.toLocaleString()} resumes`
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">AI Requests</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {planInfo.limits.aiRequestsPerMonth === -1 ? (
                  <span className="flex items-center gap-1">
                    ∞ Unlimited
                  </span>
                ) : (
                  `${planInfo.limits.aiRequestsPerMonth.toLocaleString()}/month`
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Storage</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {planInfo.limits.storageMB === -1 ? (
                  <span className="flex items-center gap-1">
                    ∞ Unlimited
                  </span>
                ) : (
                  `${planInfo.limits.storageMB.toLocaleString()} MB`
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt (if on free plan) */}
      {planInfo.currentPlan === "free" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Need More?
            </CardTitle>
            <CardDescription>
              Upgrade to a higher plan to unlock more features and higher limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Consider upgrading to Freshers or Experience plan for:
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                More jobs and resumes capacity
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Increased AI request limits
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                More storage space
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Access to Mock Interviews
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Priority support and more
              </li>
            </ul>
            <Link href="/dashboard/pricing">
              <Button className="w-full gap-2">
                <Zap className="h-4 w-4" />
                Compare Plans & Upgrade
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}


    </div>
  );
}

