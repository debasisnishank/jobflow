"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  BarChart3, 
  FileText, 
  Sparkles, 
  Calendar, 
  CheckCircle2,
  Users,
  Mail,
  Mic,
  Type,
  Video,
  ClipboardList,
  ArrowRight,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SectionContainer } from "@/components/common/SectionContainer";
import { useAppConfigContext } from "@/contexts/AppConfigContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  category: string;
  highlights?: string[];
}

const features: Feature[] = [
  {
    icon: Briefcase,
    title: "Application Tracker",
    category: "Core Features",
    description:
      "Keep a detailed record of all your job applications, including company details, job titles, application dates, and current status.",
    highlights: [
      "Track application status in real-time",
      "Organize by company, role, or date",
      "Set reminders and follow-up dates",
      "Export data for analysis"
    ],
  },
  {
    icon: BarChart3,
    title: "Activity Dashboard",
    category: "Core Features",
    description:
      "Visualize your job search progress with an interactive dashboard that provides insights into your application activities and success rates.",
    highlights: [
      "Real-time progress tracking",
      "Success rate analytics",
      "Activity timeline visualization",
      "Performance metrics"
    ],
  },
  {
    icon: FileText,
    title: "Resume Management",
    category: "Core Features",
    description:
      "Store and manage multiple resumes. Use AI to get reviews and match your resume with job descriptions for better opportunities.",
    highlights: [
      "Multiple resume versions",
      "AI-powered resume analysis",
      "Job-resume matching scores",
      "ATS optimization tips"
    ],
  },
  {
    icon: Users,
    title: "Networking Contacts",
    category: "Networking",
    description:
      "Manage your professional network with detailed contact information, interaction history, and relationship tracking for better networking.",
    highlights: [
      "Comprehensive contact database",
      "Interaction history tracking",
      "Relationship management",
      "Linked job applications"
    ],
  },
  {
    icon: ClipboardList,
    title: "Interview Management",
    category: "Interview Preparation",
    description:
      "Schedule and track interviews with detailed notes, questions, feedback, and outcomes. Manage multiple interview rounds and statuses.",
    highlights: [
      "Interview scheduling and tracking",
      "Question and answer management",
      "Feedback and rating system",
      "Multi-round interview support"
    ],
  },
  {
    icon: Video,
    title: "AI Mock Interview",
    category: "Interview Preparation",
    description:
      "Practice with AI-powered mock interviews featuring 28+ realistic scenarios. Get real-time feedback and improve your interview skills.",
    highlights: [
      "28+ interview scenarios",
      "Video call practice sessions",
      "Real-time AI feedback",
      "Performance analytics"
    ],
  },
  {
    icon: Sparkles,
    title: "AI Toolbox",
    category: "AI Tools",
    description:
      "Complete suite of AI-powered writing tools: Personal Brand Statement, Email Writer, Elevator Pitch, and LinkedIn content generators.",
    highlights: [
      "Personal Brand Statement",
      "Email Writer",
      "Elevator Pitch Generator",
      "LinkedIn Content Tools"
    ],
  },
  {
    icon: Mail,
    title: "Email Writer",
    category: "AI Tools",
    description:
      "Generate professional, personalized emails for job applications, follow-ups, networking, and outreach with AI assistance.",
    highlights: [
      "Multiple email types",
      "Personalized content",
      "Professional tone",
      "Quick generation"
    ],
  },
  {
    icon: Mic,
    title: "Elevator Pitch",
    category: "AI Tools",
    description:
      "Create compelling 30-second elevator pitches tailored to your target role, audience, and purpose with AI guidance.",
    highlights: [
      "30-second pitch format",
      "Role-specific customization",
      "Multiple purpose options",
      "Practice-ready content"
    ],
  },
  {
    icon: Type,
    title: "LinkedIn Optimization",
    category: "AI Tools",
    description:
      "Generate attention-grabbing LinkedIn headlines, compelling About sections, and engaging posts to boost your professional presence.",
    highlights: [
      "LinkedIn Headline Generator",
      "About Section Writer",
      "Post Generator",
      "Keyword optimization"
    ],
  },
  {
    icon: Calendar,
    title: "Activity Tracking",
    category: "Core Features",
    description:
      "Track your job search activities, interviews, networking events, and time spent on each activity to stay organized.",
    highlights: [
      "Time tracking",
      "Activity categorization",
      "Productivity insights",
      "Goal setting"
    ],
  },
  {
    icon: CheckCircle2,
    title: "Self-Hosted",
    category: "Security",
    description:
      "Self-hosted for full control over your data and privacy. Your information stays secure and under your control.",
    highlights: [
      "Full data control",
      "Privacy protection",
      "Customizable deployment",
      "No third-party data sharing"
    ],
  },
];

const categories = [
  "All Features",
  "Core Features",
  "AI Tools",
  "Networking",
  "Interview Preparation",
  "Security",
];

export function FeaturesPageContent() {
  const { config } = useAppConfigContext();
  const [selectedCategory, setSelectedCategory] = useState("All Features");
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const filteredFeatures = selectedCategory === "All Features"
    ? features
    : features.filter(f => f.category === selectedCategory);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const headerChildren = headerRef.current?.children;
      const cardChildren = cardsRef.current?.children;

      if (headerChildren && headerChildren.length > 0) {
        gsap.fromTo(headerChildren,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
          }
        );
      }

      if (cardChildren && cardChildren.length > 0) {
        gsap.fromTo(cardChildren,
          { y: 60, opacity: 0 },
          {
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <div ref={sectionRef} className="w-full">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Powerful Features</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Everything You Need to
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Succeed in Your Job Search
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Discover comprehensive tools designed to streamline your job search, enhance your applications, and accelerate your career growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md h-11 px-8 text-base font-semibold bg-white text-[#3B82F6] hover:bg-gray-100 shadow-lg transition-all duration-200">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 text-[#3B82F6]" />
              </button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#3B82F6] px-8 font-semibold">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="w-full bg-white border-b sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-4">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-[#3B82F6] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <SectionContainer background="white" padding="lg" className="py-16 md:py-24">
        <div ref={headerRef} className="mx-auto max-w-7xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {selectedCategory === "All Features" 
                ? "All Features" 
                : `${selectedCategory}`}
            </h2>
            <p className="text-lg text-gray-600">
              {selectedCategory === "All Features" 
                ? "Explore all the powerful features we offer"
                : `Discover our ${selectedCategory.toLowerCase()} features`}
            </p>
          </div>

          <div ref={cardsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:border-[#3B82F6]/50 transition-all duration-300 h-full flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-[#1D4ED8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative pb-4">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#1D4ED8]/10 group-hover:from-[#3B82F6]/20 group-hover:to-[#1D4ED8]/20 transition-all duration-300">
                    <feature.icon className="h-7 w-7 text-[#3B82F6] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
                      {feature.category}
                    </span>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#3B82F6] transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative flex-1 flex flex-col">
                  <CardDescription className="text-base leading-relaxed text-gray-600 mb-4">
                    {feature.description}
                  </CardDescription>
                  {feature.highlights && feature.highlights.length > 0 && (
                    <ul className="space-y-2 mt-auto">
                      {feature.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <Target className="h-4 w-4 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* CTA Section */}
      <div className="w-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Join thousands of job seekers who are using {config.brandName} to land their dream jobs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md h-11 px-8 text-base font-semibold bg-white text-[#3B82F6] hover:bg-gray-100 shadow-lg transition-all duration-200">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 text-[#3B82F6]" />
              </button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#3B82F6] px-8 font-semibold">
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

