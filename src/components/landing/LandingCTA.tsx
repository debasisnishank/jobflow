"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAppConfigContext } from "@/contexts/AppConfigContext";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LandingCTA() {
  const { config } = useAppConfigContext();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "top 40%",
          toggleActions: "play none none reverse"
        },
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.5)"
      });

      gsap.from(headingRef.current?.children || [], {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 75%",
          end: "top 45%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.from(descRef.current, {
        scrollTrigger: {
          trigger: descRef.current,
          start: "top 75%",
          end: "top 45%",
          toggleActions: "play none none reverse"
        },
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out"
      });

      gsap.from(buttonsRef.current?.children || [], {
        scrollTrigger: {
          trigger: buttonsRef.current,
          start: "top 75%",
          end: "top 45%",
          toggleActions: "play none none reverse"
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out"
      });

      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        y: -30,
        ease: "none"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-20 bg-gradient-to-br from-emerald-500/10 via-white to-blue-500/10 overflow-hidden mt-[-30px] mb-[-15px]">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl blur-2xl opacity-20"></div>
          <div ref={cardRef} className="relative bg-white rounded-2xl border-2 border-gray-200 p-12 md:p-16 text-center shadow-xl">
            <h2 ref={headingRef} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text-green-blue">Ready to Transform</span>
              <br />
              <span className="text-gray-900">Your Job Search?</span>
            </h2>
            <p ref={descRef} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join {config.brandName} today and take the first step towards a more organized
              and successful job search journey.
            </p>
            <div ref={buttonsRef} className="flex flex-col gap-4 sm:flex-row justify-center pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-base font-semibold px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base font-medium px-8 h-12 border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Already have an account?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
