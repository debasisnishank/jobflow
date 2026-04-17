import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAppConfigFromDB } from "@/lib/admin/app-config.server";
import { appConfig, appConfig as staticConfig } from "@/lib/config/app.config";

export async function generateMetadata(): Promise<Metadata> {
  let config = staticConfig;
  try {
    config = await getAppConfigFromDB();
  } catch (error) {
    config = staticConfig;
  }
  return {
    title: `Terms of Service - ${config.brandName}`,
    description: `Terms of Service for ${config.brandName} platform`,
  };
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using {appConfig.brandName} ("the Service"), you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to these Terms of Service, please do not use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Permission is granted to temporarily access and use {appConfig.brandName} for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on {appConfig.brandName}</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Account</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree to
              accept responsibility for all activities that occur under your account. {appConfig.brandName} reserves the right
              to refuse service, terminate accounts, or remove content in its sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Billing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you subscribe to a paid plan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Subscriptions are billed on a monthly basis</li>
              <li>You can cancel your subscription at any time</li>
              <li>No refunds are provided for partial subscription periods</li>
              <li>All fees are non-refundable unless otherwise stated</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of any content you submit to {appConfig.brandName}. By submitting content, you grant
              {appConfig.brandName} a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your
              content solely for the purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on {appConfig.brandName} are provided on an "as is" basis. {appConfig.brandName} makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including without
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose,
              or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall {appConfig.brandName} or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of the
              use or inability to use the materials on {appConfig.brandName}, even if {appConfig.brandName} or a {appConfig.brandName} authorized
              representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Revisions</h2>
            <p className="text-muted-foreground leading-relaxed">
              {appConfig.brandName} may revise these terms of service at any time without notice. By using this Service,
              you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href={`mailto:${appConfig.supportEmail}`} className="text-primary hover:underline">
                {appConfig.supportEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
