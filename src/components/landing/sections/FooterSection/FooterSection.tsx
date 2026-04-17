"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useAppConfigContext } from "@/contexts/AppConfigContext";

function handlePricingClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const pathname = window.location.pathname;
  if (pathname === "/") {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function FooterLinksGrid() {
  const { config } = useAppConfigContext();
  
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="space-y-4">
        <BrandLogo size="md" />
        <p className="text-sm text-muted-foreground max-w-sm">
          Your all-in-one platform for job tracking, resume management, and career growth.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/#pricing"
              onClick={handlePricingClick}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Support</h3>
        <ul className="space-y-3">
          <li>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot Password
            </Link>
          </li>
          <li>
            <a
              href={`mailto:${config.supportEmail}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact Support
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FooterBottomBar() {
  const currentYear = new Date().getFullYear();
  const { config } = useAppConfigContext();

  return (
    <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t md:flex-row">
      <p className="text-sm text-muted-foreground">
        © {currentYear} {config.brandName}. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        <Link
          href="/terms"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Terms
        </Link>
        <Link
          href="/privacy"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Privacy
        </Link>
      </div>
    </div>
  );
}

export function FooterSection() {
  return (
    <footer className="relative border-t bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <FooterLinksGrid />
        <FooterBottomBar />
      </div>
    </footer>
  );
}


