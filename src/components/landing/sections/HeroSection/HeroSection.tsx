"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { GradientBackground } from "@/components/common/GradientBackground";
import { useAppConfigContext } from "@/contexts/AppConfigContext";

export function HeroSection() {
  const { config } = useAppConfigContext();
  return (
    <section className="relative w-full overflow-hidden">
      <GradientBackground variant="subtle" position="top-left" className="min-h-[90vh]">
        <div className="container flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 px-4 md:px-6">
          <div className="flex-1 flex flex-col gap-8 lg:max-w-[600px] z-10">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Take Control of Your
                <br />
                <span className="gradient-text-primary">
                  Job Search Journey
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[540px]">
                {config.brandName} is your all-in-one job application tracking system. Manage
                applications, track your progress, and leverage AI-powered insights
                to land your dream job faster.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-base md:text-lg text-foreground">
                  Track all your job applications in one place
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-base md:text-lg text-foreground">
                  AI-powered resume reviews and job matching
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-base md:text-lg text-foreground">
                  Visualize your progress with interactive dashboards
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold px-8 py-6 h-auto rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base font-medium px-8 py-6 h-auto rounded-lg border-2 hover:bg-muted/50 transition-all duration-200 w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center lg:justify-end lg:pl-12 z-10">
            <div className="relative w-full max-w-[550px] lg:max-w-[650px] aspect-[9/16] rounded-2xl overflow-hidden h-[80vh] shadow-2xl">
              <iframe
                src="https://player.vimeo.com/video/1117851937?h=0267c9d4e9&autoplay=1&loop=1&muted=1&playsinline=1&controls=0&background=1"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`${config.brandName} Hero Video`}
              />
            </div>
          </div>
        </div>
      </GradientBackground>
    </section>
  );
}


