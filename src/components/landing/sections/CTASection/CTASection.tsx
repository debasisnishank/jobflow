"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SectionContainer } from "@/components/common/SectionContainer";
import { GradientBackground } from "@/components/common/GradientBackground";
import { useAppConfigContext } from "@/contexts/AppConfigContext";

export function CTASection() {
  const { config } = useAppConfigContext();
  return (
    <SectionContainer background="gradient" padding="lg">
      <GradientBackground variant="primary" position="center" className="py-12">
        <div className="mx-auto flex max-w-[800px] flex-col items-center gap-8 rounded-2xl border-2 bg-gradient-card p-12 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight gradient-text-primary">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Join {config.brandName} today and take the first step towards a more organized
            and successful job search journey.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row pt-4">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg font-medium px-8 py-6 border-2 hover:bg-muted/50 transition-all duration-200"
              >
                Already have an account?
              </Button>
            </Link>
          </div>
        </div>
      </GradientBackground>
    </SectionContainer>
  );
}


