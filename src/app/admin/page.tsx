import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";
import { LayoutDashboard, Palette, DollarSign, Users, FileText, Briefcase, TrendingUp, UserPlus, Bot } from "lucide-react";
import Link from "next/link";
import { getAdminStats } from "@/lib/admin/stats.service";
import SubscriptionPieChart from "@/components/admin/SubscriptionPieChart";
import GrowthChartsSection from "@/components/admin/GrowthChartsSection";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const stats = await getAdminStats();

  const statCards: Array<{
    title: string;
    value: string;
    description: string;
    icon: typeof Users;
    href?: string;
  }> = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      description: `${stats.recentUsers} new in last 30 days`,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Resumes Generated",
      value: stats.totalResumes.toLocaleString(),
      description: `${stats.recentResumes} created in last 30 days`,
      icon: FileText,
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs.toLocaleString(),
      description: `${stats.recentJobs} created in last 30 days`,
      icon: Briefcase,
    },
  ];

  const subscriptionCards = [
    {
      title: "Free Plan",
      value: stats.activeSubscriptions.free.toLocaleString(),
      description: "Active subscriptions",
      icon: UserPlus,
    },
    {
      title: "Freshers Plan",
      value: stats.activeSubscriptions.freshers.toLocaleString(),
      description: "Active subscriptions",
      icon: TrendingUp,
    },
    {
      title: "Experience Plan",
      value: stats.activeSubscriptions.experience.toLocaleString(),
      description: "Active subscriptions",
      icon: TrendingUp,
    },
  ];

  const quickLinks = [
    { title: "Branding", description: "Manage app branding and appearance", icon: Palette, href: "/admin/branding" },
    { title: "Pricing Plans", description: "Configure subscription plans", icon: DollarSign, href: "/admin/pricing" },
    { title: "AI Configuration", description: "Manage AI prompts and models", icon: Bot, href: "/admin/ai-config" },
    { title: "Users", description: "Manage users and permissions", icon: Users, href: "/admin/users" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your application statistics and quick access to management tools
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const cardContent = (
            <Card className={`border border-border/60 shadow-sm backdrop-blur ${stat.href ? "cursor-pointer hover:shadow-lg transition-all" : ""}`}>
              <CardHeader className="pb-4">
                <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.title}
                </CardDescription>
                <CardTitle className="text-4xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );

          if (stat.href) {
            return (
              <Link key={stat.title} href={stat.href} className="block">
                {cardContent}
              </Link>
            );
          }

          return (
            <div key={stat.title}>
              {cardContent}
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <GrowthChartsSection
          initialStats={{
            userGrowthData: stats.userGrowthData,
            resumeGrowthData: stats.resumeGrowthData,
            subscriptionDistribution: stats.subscriptionDistribution,
          }}
        />
        <SubscriptionPieChart data={stats.subscriptionDistribution} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {subscriptionCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden border border-border/70 bg-gradient-to-br from-background via-background to-muted/40">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_45%)]" />
              <CardHeader className="relative pb-2">
                <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.title}
                </CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-border/70">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle>{link.title}</CardTitle>
                    </div>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
