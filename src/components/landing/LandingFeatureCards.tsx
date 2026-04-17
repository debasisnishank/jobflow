"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, ClipboardList, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function LandingFeatureCards() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const ctx = gsap.context(() => {
            gsap.from(".feature-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full py-16 md:py-20 bg-white">
            <div className="container px-6 md:px-8 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Get Organized Card */}
                    <Link href="/features" className="group">
                        <div className="feature-card relative bg-amber-100 rounded-2xl p-8 md:p-10 h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                            <div className="relative z-10">
                                <p className="text-sm font-medium text-amber-700 mb-2">Get Organized</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    Track everything
                                    <br />in one place
                                </h3>
                                <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900 transition-colors">
                                    <span className="text-sm font-medium">Explore tracking</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>

                            {/* Decorative Icon */}
                            <div className="absolute bottom-6 right-6 opacity-20">
                                <ClipboardList className="w-32 h-32 text-amber-600" />
                            </div>
                        </div>
                    </Link>

                    {/* AI Powered Card */}
                    <Link href="/features" className="group">
                        <div className="feature-card relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-10 h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                            <div className="relative z-10">
                                <p className="text-sm font-medium text-blue-200 mb-2">AI Powered</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    Smart tools for
                                    <br />smarter job search
                                </h3>
                                <div className="flex items-center gap-2 text-blue-100 group-hover:text-white transition-colors">
                                    <span className="text-sm font-medium">Explore AI features</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>

                            {/* Decorative Icon */}
                            <div className="absolute bottom-6 right-6 opacity-20">
                                <Sparkles className="w-32 h-32 text-white" />
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    );
}
