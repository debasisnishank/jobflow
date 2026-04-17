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
  ClipboardList
} from "lucide-react";
import { FeatureCard } from "@/components/common/FeatureCard";
import { SectionContainer } from "@/components/common/SectionContainer";

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

export function FeaturesSection() {
  return (
    <SectionContainer background="white" padding="lg">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text-primary">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to streamline your job search process
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}


