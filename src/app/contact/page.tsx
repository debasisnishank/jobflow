import { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactPageContent } from "@/components/landing/ContactPageContent";
import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `Contact Us | ${appConfig.brandName}`,
  description: `Get in touch with ${appConfig.brandName}. We're here to help with any questions or support you need.`,
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <ContactPageContent />
      </main>
      <LandingFooter />
    </div>
  );
}


