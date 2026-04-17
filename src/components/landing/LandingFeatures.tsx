"use client";

import { 
  Briefcase, 
  BarChart3, 
  FileText, 
  Sparkles, 
  Calendar, 
  CheckCircle2,
  Users,
  MessageSquare,
  Mail,
  Mic,
  Type,
  PenTool,
  Video,
  ClipboardList,
  ArrowRight
} from "lucide-react";
import { FeatureCard } from "@/components/common/FeatureCard";
import { SectionContainer } from "@/components/common/SectionContainer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Briefcase,
    title: "Application Tracker",
    description:
      "Keep a detailed record of all your job applications, including company details, job titles, application dates, and current status.",
  },
  {
    icon: BarChart3,
    title: "Activity Dashboard",
    description:
      "Visualize your job search progress with an interactive dashboard that provides insights into your application activities and success rates.",
  },
  {
    icon: FileText,
    title: "Resume Management",
    description:
      "Store and manage multiple resumes. Use AI to get reviews and match your resume with job descriptions for better opportunities.",
  },
  {
    icon: Users,
    title: "Networking Contacts",
    description:
      "Manage your professional network with detailed contact information, interaction history, and relationship tracking for better networking.",
  },
  {
    icon: ClipboardList,
    title: "Interview Management",
    description:
      "Schedule and track interviews with detailed notes, questions, feedback, and outcomes. Manage multiple interview rounds and statuses.",
  },
  {
    icon: Video,
    title: "AI Mock Interview",
    description:
      "Practice with AI-powered mock interviews featuring 28+ realistic scenarios. Get real-time feedback and improve your interview skills.",
  },
  {
    icon: Sparkles,
    title: "AI Toolbox",
    description:
      "Complete suite of AI-powered writing tools: Personal Brand Statement, Email Writer, Elevator Pitch, and LinkedIn content generators.",
  },
  {
    icon: Mail,
    title: "Email Writer",
    description:
      "Generate professional, personalized emails for job applications, follow-ups, networking, and outreach with AI assistance.",
  },
  {
    icon: Mic,
    title: "Elevator Pitch",
    description:
      "Create compelling 30-second elevator pitches tailored to your target role, audience, and purpose with AI guidance.",
  },
  {
    icon: Type,
    title: "LinkedIn Optimization",
    description:
      "Generate attention-grabbing LinkedIn headlines, compelling About sections, and engaging posts to boost your professional presence.",
  },
  {
    icon: Calendar,
    title: "Activity Tracking",
    description:
      "Track your job search activities, interviews, networking events, and time spent on each activity to stay organized.",
  },
  {
    icon: CheckCircle2,
    title: "Self-Hosted",
    description:
      "Self-hosted for full control over your data and privacy.",
  },
];

export function LandingFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <SectionContainer id="features" background="white" padding="lg" className="scroll-mt-24">
      <div ref={sectionRef} className="mx-auto flex max-w-[1200px] flex-col items-center gap-12">
        <div ref={headerRef} className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text-green-blue">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features to streamline your job search process
          </p>
        </div>
        <div ref={cardsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full">
          {features.slice(0, 6).map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        <div className="text-center pt-8">
          <Link href="/features">
            <Button variant="outline" size="lg" className="gap-2">
              View All Features
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
