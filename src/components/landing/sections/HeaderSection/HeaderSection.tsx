"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/common/BrandLogo";

export function HeaderSection() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <BrandLogo size="md" />
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/signin">
            <Button
              variant="ghost"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 transition-all duration-200 hover:shadow-md">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}


