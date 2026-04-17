"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionContainer } from "@/components/common/SectionContainer";

interface FeatureItem {
  title: string;
  description: string;
}

interface FeatureSectionProps {
  badge: string;
  title: string;
  features: FeatureItem[];
  imageSrc: string;
  imageAlt: string;
  imageOrder?: "left" | "right";
}

function FeatureItemCard({ title, description }: FeatureItem) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-primary/20">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Check className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-2 text-lg">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-4 bg-gradient-primary rounded-2xl blur-2xl opacity-30"></div>
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            width={600}
            height={800}
            className="w-full h-auto rounded-xl shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function FeatureContent({ badge, title, features }: { badge: string; title: string; features: FeatureItem[] }) {
  return (
    <div className="flex flex-col justify-center gap-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="text-sm font-semibold text-primary uppercase tracking-wider px-4 py-1.5">
          {badge}
        </Badge>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight gradient-text-primary">
          {title}
        </h2>
      </div>
      
      <div className="flex flex-col gap-6">
        {features.map((feature, index) => (
          <FeatureItemCard key={index} {...feature} />
        ))}
      </div>
      
      <Link href="/signup" className="mt-2">
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
        >
          Get Started Free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}

function FeatureSection({ badge, title, features, imageSrc, imageAlt, imageOrder = "right" }: FeatureSectionProps) {
  const isImageRight = imageOrder === "right";
  
  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20 items-center">
      {isImageRight ? (
        <>
          <div className="flex flex-col justify-center gap-8 order-2 lg:order-1">
            <FeatureContent badge={badge} title={title} features={features} />
          </div>
          <div className="w-full flex items-center justify-center order-1 lg:order-2">
            <FeatureImage src={imageSrc} alt={imageAlt} />
          </div>
        </>
      ) : (
        <>
          <FeatureImage src={imageSrc} alt={imageAlt} />
          <FeatureContent badge={badge} title={title} features={features} />
        </>
      )}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center my-16 md:my-20">
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </div>
  );
}

function SectionHeading() {
  return (
    <div className="text-center mb-16 md:mb-20">
      <div className="inline-block mb-4">
        <Badge variant="secondary" className="text-sm font-semibold text-primary uppercase tracking-wider px-4 py-2">
          Features
        </Badge>
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text-primary">
        Core Feature Highlights
      </h2>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Powerful AI-driven tools to help you land your dream job faster
      </p>
    </div>
  );
}

const aiJobMatchingFeatures = [
  {
    title: "Smart Job Matching",
    description: "Get instant match scores by comparing your resume with job descriptions. See how well your skills, experience, and qualifications align with each opportunity.",
  },
  {
    title: "AI Resume Review",
    description: "Receive detailed feedback on your resume including strengths, weaknesses, and actionable suggestions to improve your ATS compatibility and overall quality.",
  },
  {
    title: "Personalized Insights",
    description: "Understand exactly why you're a good fit with detailed analysis of experience level, skills match, and industry expertise for each position.",
  },
];

const applicationTrackingFeatures = [
  {
    title: "Organized Dashboard",
    description: "Track all your job applications in one place with detailed status updates, application dates, and company information at a glance.",
  },
  {
    title: "Activity Monitoring",
    description: "Visualize your job search progress with interactive charts showing application trends, response rates, and interview schedules.",
  },
  {
    title: "Resume & Cover Letter Management",
    description: "Store multiple resumes and use AI to generate personalized cover letters tailored to each job application.",
  },
];

const matchScoreFeatures = [
  {
    title: "Detailed Match Analysis",
    description: "Get comprehensive breakdowns showing exactly how your resume matches each job. See match scores for experience level, skills, education, and industry experience to identify areas for improvement.",
  },
  {
    title: "Actionable Recommendations",
    description: "Receive specific suggestions on how to improve your match score. Get recommendations on missing skills, keywords to add, and experience to highlight based on AI analysis of job descriptions.",
  },
];

const resumeManagementFeatures = [
  {
    title: "Multiple Resume Management",
    description: "Create and manage multiple resumes with structured sections. Upload resume files or build resumes with contact info, work experience, education, and skills sections all in one place.",
  },
  {
    title: "AI Resume Review",
    description: "Get detailed AI-powered feedback on your resume including strengths, weaknesses, and actionable suggestions. Improve your resume's ATS compatibility and overall quality with intelligent recommendations.",
  },
  {
    title: "Resume Matching",
    description: "Use your saved resumes with AI job matching to see how well each resume aligns with different job opportunities. Choose the best resume version for each application to maximize your match score.",
  },
];

export function CoreFeaturesSection() {
  return (
    <SectionContainer background="gradient" padding="lg">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <SectionHeading />

        <FeatureSection
          badge="AI-Powered"
          title="Job Matching & Resume Analysis"
          features={aiJobMatchingFeatures}
          imageSrc="/core-features-top-right.png"
          imageAlt="Job Match Score Card"
          imageOrder="right"
        />

        <SectionDivider />

        <FeatureSection
          badge="Organization"
          title="Comprehensive Application Tracking"
          features={applicationTrackingFeatures}
          imageSrc="/core-features-bottom-left.png"
          imageAlt="Application Tracking Dashboard"
          imageOrder="left"
        />

        <SectionDivider />

        <FeatureSection
          badge="Optimization"
          title="Actionable Tips To Improve Your Match Score"
          features={matchScoreFeatures}
          imageSrc="/core-features-match-score.png"
          imageAlt="Match Score Overview and Insights"
          imageOrder="right"
        />

        <SectionDivider />

        <FeatureSection
          badge="Professional"
          title="Professional Resume Management"
          features={resumeManagementFeatures}
          imageSrc="/core-features-resume.png"
          imageAlt="Professional Resume Management"
          imageOrder="left"
        />
      </div>
    </SectionContainer>
  );
}


