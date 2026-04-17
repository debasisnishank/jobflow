import { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingPageContent } from "@/components/landing/PricingPageContent";
import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `Pricing | ${appConfig.brandName}`,
  description: `Choose the perfect plan for your job search journey. ${appConfig.brandName} offers flexible pricing options to suit your needs.`,
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <PricingPageContent />
      </main>
      <LandingFooter />
    </div>
  );
}


