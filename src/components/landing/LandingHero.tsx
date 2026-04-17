"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Briefcase, Zap, Calendar, BarChart3 } from "lucide-react";
import { useAppConfigContext } from "@/contexts/AppConfigContext";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}



export function LandingHero() {
  const { config } = useAppConfigContext();
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate heading
      tl.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2
      });

      // Animate CTA section
      tl.from(ctaRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8
      }, "-=0.4");

      // Animate preview
      tl.from(previewRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-visible bg-gradient-to-b from-slate-50 via-white to-indigo-50/20"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mesh gradient */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />

        {/* Animated blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] blob-1 animate-blob opacity-30" />
        <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] blob-2 animate-blob opacity-25" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] blob-3 animate-blob opacity-20" style={{ animationDelay: "4s" }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(255,255,255,0.85)_70%)]" />
      </div>



      {/* Main Content */}
      <div className="container relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 md:pt-40 pb-20">

        {/* Headline */}
        <div ref={headingRef} className="mb-8 max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 tracking-tight leading-[1.1]">
            Land Your Dream
            <br />
            <span className="relative inline-block">
              <span className="gradient-animated-text">
                Job Faster
              </span>
              {/* Decorative underline */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-500/30" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0,5 Q40,0 100,5 T200,5" stroke="currentColor" strokeWidth="3" fill="none" className="animate-pulse" />
              </svg>
            </span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          {config.brandName} combines <span className="font-semibold text-gray-800">AI-powered tools</span> with smart tracking to help you manage applications, ace interviews, and land offers.
        </p>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
          {[
            "AI Resume Optimization",
            "Smart Job Matching",
            "Interview Preparation"
          ].map((feature, index) => (
            <div key={feature} className="flex items-center gap-2 text-gray-600">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm md:text-base font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div ref={ctaRef} className="flex flex-col items-center gap-8 mb-14">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="shimmer-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-10 h-12 rounded-full shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 transition-all duration-300 text-base group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/features">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold px-10 h-12 rounded-full border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 text-base text-slate-700 backdrop-blur-sm"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </div>



        {/* Dashboard Preview */}
        <div ref={previewRef} className="relative w-full max-w-5xl mx-auto">
          {/* Glow effect behind preview */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/15 via-indigo-500/10 to-transparent blur-3xl transform scale-110 -z-10" />
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/8 via-indigo-500/8 to-blue-500/8 rounded-[40px] blur-2xl -z-10 animate-pulse" />

          {/* Preview container */}
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/80 bg-white/95 backdrop-blur-xl">
            {/* Elegant Browser chrome */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-slate-50/95 to-slate-100/95 border-b border-slate-200/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-sm shadow-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-sm shadow-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-sm shadow-green-500/30" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-7 bg-white/90 rounded-lg border border-slate-200/60 flex items-center px-3 shadow-inner">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-500 mr-2" />
                  <span className="text-xs text-slate-500 font-medium">app.jobflow.app/dashboard</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-60">
                <div className="w-4 h-4 rounded bg-slate-200" />
                <div className="w-4 h-4 rounded bg-slate-200" />
              </div>
            </div>

            {/* Dashboard layout with sidebar */}
            <div className="flex min-h-[320px] md:min-h-[450px]">
              {/* Sidebar */}
              <div className="hidden md:flex w-48 flex-col bg-white border-r border-slate-200/60 p-3">
                {/* Logo */}
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">JobFlow</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                  {/* Active item */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
                    <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center">
                      <BarChart3 className="w-2.5 h-2.5" />
                    </div>
                    Dashboard
                  </div>

                  {[
                    { label: "My Jobs", icon: "briefcase" },
                    { label: "Activities", icon: "calendar" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 text-xs hover:bg-slate-50">
                      <div className="w-4 h-4 rounded bg-slate-100" />
                      {item.label}
                    </div>
                  ))}

                  <p className="text-[9px] uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">Profile & Documents</p>
                  {["Profile", "Resume Builder"].map((item) => (
                    <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 text-xs hover:bg-slate-50">
                      <div className="w-4 h-4 rounded bg-slate-100" />
                      {item}
                    </div>
                  ))}

                  <p className="text-[9px] uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">AI Tools</p>
                  {["AI Toolbox", "Mock Interview"].map((item) => (
                    <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 text-xs hover:bg-slate-50">
                      <div className="w-4 h-4 rounded bg-slate-100" />
                      {item}
                      {item === "Mock Interview" && (
                        <span className="ml-auto text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">BETA</span>
                      )}
                    </div>
                  ))}
                </nav>

                {/* User profile at bottom */}
                <div className="mt-auto pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 px-2 py-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                      AJ
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">Alex Johnson</p>
                      <p className="text-[9px] text-slate-400 truncate">alex@email.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 md:p-5 bg-gradient-to-br from-slate-100 via-slate-50 to-white">
                {/* DashboardHero-style banner */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl mb-4">
                  <div className="relative p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs tracking-wide text-white/70">Weekly focus</p>
                        <h2 className="text-lg md:text-xl font-semibold tracking-tight">Great work—12 applications so far</h2>
                        <p className="text-sm text-white/80">3 applications away from this week's target.</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold shadow-lg cursor-pointer hover:bg-white/30 transition-all">
                          Add job
                        </div>
                        <div className="px-3 py-1.5 border border-white/40 rounded-lg text-xs font-medium cursor-pointer hover:bg-white/20 transition-all">
                          Log activity
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DashboardHighlights-style cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { title: "Weekly total", value: "12", helper: "1.7 avg per day" },
                    { title: "Best day", value: "Tuesday", helper: "4 jobs submitted" },
                    { title: "Active streak", value: "5 days", helper: "Keep the streak alive!" },
                  ].map((highlight, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg border border-slate-200/70 bg-gradient-to-br from-white via-white to-indigo-50/30 p-3 shadow-sm">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_50%)]" />
                      <div className="relative">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">{highlight.title}</p>
                        <p className="text-xl font-bold text-slate-900">{highlight.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{highlight.helper}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Number cards and chart row */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Number cards */}
                  <div className="col-span-2 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200/70 bg-white p-3 shadow-sm">
                      <p className="text-xs text-slate-500 mb-1">Last 7 days</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">12</span>
                        <span className="text-xs text-blue-600 font-medium">+15%</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200/70 bg-white p-3 shadow-sm">
                      <p className="text-xs text-slate-500 mb-1">Last 30 days</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">47</span>
                        <span className="text-xs text-blue-600 font-medium">+24%</span>
                      </div>
                    </div>
                  </div>

                  {/* Goal progress */}
                  <div className="rounded-lg border border-slate-200/70 bg-gradient-to-br from-white to-violet-50/50 p-3 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Goal Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="relative w-10 h-10">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeDasharray="80 100" strokeLinecap="round" />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#2563EB" />
                              <stop offset="100%" stopColor="#4F46E5" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">80%</div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">12/15</p>
                        <p className="text-[10px] text-slate-500">This week</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekly bar chart */}
                <div className="mt-3 rounded-lg border border-slate-200/70 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-slate-700">Weekly Jobs</p>
                    <div className="flex gap-1">
                      <div className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 rounded text-blue-600">Jobs</div>
                      <div className="px-2 py-0.5 text-[10px] font-medium text-slate-400">Activities</div>
                    </div>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                      const heights = [30, 60, 45, 80, 55, 25, 40];
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t transition-all hover:from-blue-700 hover:to-indigo-600"
                            style={{ height: `${heights[i]}%` }}
                          />
                          <span className="text-[8px] text-slate-400">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Close main content div */}
            </div>
            {/* Close flex container */}
          </div>
        </div>
      </div>
    </section>
  );
}
