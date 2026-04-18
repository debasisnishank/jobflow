"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ClipboardList,
    BarChart3,
    Sparkles,
    FileText,
    Users,
    Shield,
    Mic,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppConfigContext } from "@/contexts/AppConfigContext";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const jobSeekerBenefits = [
    {
        icon: ClipboardList,
        title: "Track all applications in one place",
        description: "Keep a detailed record of every job application with status updates, dates, and notes."
    },
    {
        icon: FileText,
        title: "AI-powered resume reviews",
        description: "Get detailed feedback on your resume including strengths, weaknesses, and ATS compatibility."
    },
    {
        icon: Target,
        title: "Smart job matching scores",
        description: "Compare your resume against job descriptions to identify best-fit opportunities."
    },
    {
        icon: Sparkles,
        title: "Personalized cover letters",
        description: "Generate tailored cover letters for each job application with AI assistance."
    }
];

const platformBenefits = [
    {
        icon: Sparkles,
        title: "Complete AI toolbox",
        description: "Email writer, elevator pitch, LinkedIn optimizer, and personal brand statement generators."
    },
    {
        icon: Mic,
        title: "Mock interview practice",
        description: "Practice with 28+ realistic AI-powered interview scenarios and get instant feedback."
    },
    {
        icon: BarChart3,
        title: "Activity dashboard with insights",
        description: "Visualize your job search progress with charts, calendars, and goal tracking."
    },
    {
        icon: Shield,
        title: "Self-hosted for full control",
        description: "Your data stays private. Deploy on your own server with complete ownership."
    }
];

export function LandingValueProps() {
    const { config } = useAppConfigContext();
    const sectionRef = useRef<HTMLDivElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const ctx = gsap.context(() => {
            // Animate left column
            gsap.from(leftColRef.current?.children || [], {
                scrollTrigger: {
                    trigger: leftColRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out"
            });

            // Animate right column
            gsap.from(rightColRef.current?.children || [], {
                scrollTrigger: {
                    trigger: rightColRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
            <div className="container px-6 md:px-8 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left Column - Job Seekers */}
                    <div ref={leftColRef} className="space-y-8">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-2">Got goals?</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Why job seekers love us
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {jobSeekerBenefits.map((benefit, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm">
                                        <benefit.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Link href="/features">
                                <Button variant="outline" className="rounded-full px-6 border-slate-300 hover:border-blue-400 hover:bg-blue-50/50">
                                    Learn more
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                                    Sign up
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Platform Benefits */}
                    <div ref={rightColRef} className="space-y-8 md:bg-gradient-to-br md:from-blue-50/50 md:to-indigo-50/30 md:p-8 md:rounded-2xl">
                        <div>
                            <p className="text-sm font-medium text-indigo-600 mb-2">Built for success</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Why {config.brandName} helps
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {platformBenefits.map((benefit, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center shadow-sm">
                                        <benefit.icon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Link href="/about">
                                <Button variant="outline" className="rounded-full px-6 border-slate-300 hover:border-blue-400 hover:bg-blue-50/50">
                                    Learn more
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/20">
                                    Sign up
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
