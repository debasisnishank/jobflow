import { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingValueProps } from "@/components/landing/LandingValueProps";
import { LandingStatsSection } from "@/components/landing/LandingStatsSection";
import { LandingAIShowcase } from "@/components/landing/LandingAIShowcase";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFeatureCards } from "@/components/landing/LandingFeatureCards";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getAppConfigFromDB } from "@/lib/admin/app-config.server";
import { appConfig as staticConfig } from "@/lib/config/app.config";

export async function generateMetadata(): Promise<Metadata> {
  let config = staticConfig;
  try {
    config = await getAppConfigFromDB();
  } catch (error) {
    config = staticConfig;
  }

  return {
    title: config.brandName,
    description: `${config.description}. Manage your job search journey with AI-powered resume reviews and job matching.`,
  };
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingValueProps />
        <LandingStatsSection />
        <LandingAIShowcase />
        <LandingTestimonials />
        <LandingFeatureCards />
        <LandingPricing />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
