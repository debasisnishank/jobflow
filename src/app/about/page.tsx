import { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AboutPageContent } from "@/components/landing/AboutPageContent";
import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `About Us | ${appConfig.brandName}`,
  description: `Learn about ${appConfig.brandName} and our mission to help job seekers succeed in their career journey.`,
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <AboutPageContent />
      </main>
      <LandingFooter />
    </div>
  );
}


