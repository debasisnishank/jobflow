"use strict";

import { FeatureSection, SectionDivider, SectionHeading } from "./LandingCoreFeaturesSection";

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

export function LandingCoreFeatures() {
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
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
    </section>
  );
}
