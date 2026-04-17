import { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { FAQPageContent } from "@/components/landing/FAQPageContent";
import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `FAQ | ${appConfig.brandName}`,
  description: `Frequently asked questions about ${appConfig.brandName}. Find answers to common questions about features, pricing, and more.`,
};

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <FAQPageContent />
      </main>
      <LandingFooter />
    </div>
  );
}


