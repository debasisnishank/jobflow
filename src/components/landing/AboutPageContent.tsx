"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Zap, Shield, ArrowRight, Heart, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useAppConfigContext } from "@/contexts/AppConfigContext";
import { contentConfig } from "@/lib/config/content.config";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Users,
  Zap,
  Shield,
};

const values = contentConfig.values.map((value) => ({
  ...value,
  icon: iconMap[value.icon] || Target,
}));

const stats = [
  { label: "Active Users", value: contentConfig.stats.activeUsers },
  { label: "Job Applications Tracked", value: contentConfig.stats.jobApplicationsTracked },
  { label: "Resumes Analyzed", value: contentConfig.stats.resumesAnalyzed },
  { label: "Success Stories", value: contentConfig.stats.successStories },
];

export function AboutPageContent() {
  const { config } = useAppConfigContext();
  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Heart className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            About {config.brandName}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            We're on a mission to make job searching easier, smarter, and more successful for everyone.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="w-full bg-white py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {config.brandName} was born from a simple observation: job searching is hard, and it shouldn't be.
              We believe that everyone deserves access to powerful tools that can help them find their dream job.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our platform combines the power of AI with intuitive design to help you track applications,
              optimize your resume, prepare for interviews, and ultimately land the job you want.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {values.map((value, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#3B82F6]/10 to-[#1D4ED8]/10">
                      <value.icon className="h-6 w-6 text-[#3B82F6]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full bg-gray-50 py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {config.brandName} by the Numbers
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of job seekers who are using our platform to advance their careers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#3B82F6] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="w-full bg-white py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We Offer</h2>
            <p className="text-lg text-gray-600">
              A comprehensive suite of tools designed to support every step of your job search journey.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Application Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Keep track of all your job applications in one place. Never lose track of where you've applied,
                  when you applied, or what the status is.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get AI-powered resume reviews, job matching scores, and personalized recommendations
                  to help you stand out to employers.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Interview Preparation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Practice with AI mock interviews, manage your interview schedule, and get feedback
                  to improve your performance.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Network Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Build and maintain your professional network with our contact management tools.
                  Track interactions and stay connected with your network.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Join thousands of job seekers who are using {config.brandName} to land their dream jobs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md h-11 px-8 text-base font-semibold bg-white text-[#3B82F6] hover:bg-gray-100 shadow-lg transition-all duration-200">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 text-[#3B82F6]" />
              </button>
            </Link>
            <Link href="/features">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#3B82F6] px-8 font-semibold">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


