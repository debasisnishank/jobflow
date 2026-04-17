import { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { FeaturesPageContent } from "@/components/landing/FeaturesPageContent";
import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `Features | ${appConfig.brandName}`,
  description: `Discover all the powerful features ${appConfig.brandName} offers to streamline your job search and career growth.`,
};

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <FeaturesPageContent />
      </main>
      <LandingFooter />
    </div>
  );
}


