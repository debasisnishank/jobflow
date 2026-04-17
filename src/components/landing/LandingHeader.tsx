"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setMobileMenuOpen(false);
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 lg:px-8 pt-4">
      <header
        className={`
          relative mx-auto max-w-6xl rounded-2xl overflow-hidden
          transition-all duration-500 ease-out
          ${isScrolled
            ? "bg-white/90 shadow-2xl shadow-blue-500/10 border-transparent"
            : "bg-white/70 shadow-xl shadow-blue-500/5"
          }
          backdrop-blur-xl
        `}
        style={{
          background: isScrolled
            ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.7) 100%)',
        }}
      >
        {/* Gradient border effect */}
        <div
          className={`
            absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500
            ${isScrolled ? 'opacity-100' : 'opacity-60'}
          `}
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(29,78,216,0.15) 50%, rgba(99,102,241,0.2) 100%)',
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
          }}
        />

        {/* Inner glow effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-50"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.1) 0%, transparent 60%)',
          }}
        />

        <div className="relative flex h-16 items-center justify-between px-5 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-10 lg:gap-12">
            <Link
              href="/"
              className="flex items-center transition-all duration-300 hover:scale-105 relative z-10 group"
            >
              <div className="relative">
                <BrandLogo size="sm" />
                {/* Logo glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 relative z-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="nav-underline relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-300"
                >
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="nav-underline relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-300 group"
                >
                  <Sparkles className="h-4 w-4 group-hover:rotate-12 group-hover:text-blue-500 transition-all duration-300 relative z-10" />
                  <span className="relative z-10">Dashboard</span>
                </Link>
              )}
            </nav>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button
                    className="shimmer-button relative bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-6 py-2.5 h-auto rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group border-0"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Dashboard
                    </span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signin">
                    <Button
                      variant="ghost"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-300 px-5"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      className="shimmer-button relative bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-6 py-2.5 h-auto rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group border-0"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100/50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}
                />
                <X
                  className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-500 ease-out
            ${mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="border-t border-gray-200/50">
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
                >
                  <Sparkles className="h-4 w-4" />
                  Dashboard
                </Link>
              )}

              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200/50">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button
                      className="w-full shimmer-button bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Dashboard
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/signin">
                      <Button
                        variant="outline"
                        className="w-full text-sm font-medium border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        className="w-full shimmer-button bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Get Started
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
