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

export function LandingFooter() {
  const currentYear = new Date().getFullYear();
  const { config } = useAppConfigContext();

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-sm text-gray-600 max-w-sm">
              {config.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-sm text-gray-600 hover:text-[#3B82F6] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-600 hover:text-[#3B82F6] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-[#3B82F6] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-[#3B82F6] transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-[#3B82F6] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${config.supportEmail}`}
                  className="text-sm text-gray-600 hover:text-[#3B82F6] transition-colors"
                >
                  Email Support
                </a>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-[#3B82F6] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-gray-200 md:flex-row">
          <p className="text-sm text-gray-600">
            © {currentYear} {config.brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-xs text-gray-600 hover:text-[#3B82F6] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-gray-600 hover:text-[#3B82F6] transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

