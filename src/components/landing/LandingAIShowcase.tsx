"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function LandingAIShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const ctx = gsap.context(() => {
            gsap.from(contentRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none"
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });

            gsap.from(chatRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none"
                },
                x: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: "power3.out"
            });

            // Animate chat messages sequentially
            const messages = chatRef.current?.querySelectorAll('.chat-message');
            if (messages) {
                gsap.from(messages, {
                    scrollTrigger: {
                        trigger: chatRef.current,
                        start: "top 70%",
                        toggleActions: "play none none none"
                    },
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.3,
                    delay: 0.5,
                    ease: "power3.out"
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full py-20 md:py-28 bg-gray-50 overflow-hidden">
            <div className="container px-6 md:px-8 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div ref={contentRef} className="space-y-6">
                        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            AI Powered
                        </span>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            Meet your AI
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
                                Job Search Assistant.
                            </span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                            Here to help with all the work. Our AI reviews your resume,
                            matches you with jobs, generates cover letters, and prepares
                            you for interviews — all in a matter of minutes.
                            <br />
                            <em className="text-gray-500">It&apos;s that easy.</em>
                        </p>

                        <Link href="/features">
                            <Button variant="outline" className="rounded-full px-6 border-gray-300 hover:border-gray-400">
                                Learn more
                            </Button>
                        </Link>
                    </div>

                    {/* Right - Chat UI Mockup */}
                    <div ref={chatRef} className="relative">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-4">

                            {/* User Message */}
                            <div className="chat-message flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-medium text-gray-600">You</span>
                                </div>
                                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-[280px]">
                                    <p className="text-sm text-gray-700">
                                        Review my resume for a <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Software Engineer</span> position
                                    </p>
                                </div>
                            </div>

                            {/* AI Response */}
                            <div className="chat-message flex items-start gap-3 justify-end">
                                <div className="bg-blue-600 rounded-2xl rounded-tr-none px-4 py-3 max-w-[300px]">
                                    <p className="text-sm text-white">
                                        I&apos;ve analyzed your resume. Here are my recommendations for improvement...
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-white">AI</span>
                                </div>
                            </div>

                            {/* Results Card */}
                            <div className="chat-message bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <p className="text-xs text-gray-500 mb-3">Your resume analysis</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Sarah Johnson</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">95% Match</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Strong in: React, Node.js</span>
                                        <div className="flex gap-1">
                                            <button className="w-6 h-6 rounded-full border border-green-500 text-green-500 flex items-center justify-center hover:bg-green-50">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Typing indicator */}
                            <div className="chat-message flex items-center gap-2 text-gray-400">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span className="text-xs">AI is generating cover letter...</span>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-100 rounded-full opacity-50 blur-xl" />
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-100 rounded-full opacity-50 blur-xl" />
                    </div>

                </div>
            </div>
        </section>
    );
}
