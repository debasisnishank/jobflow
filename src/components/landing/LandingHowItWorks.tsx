"use strict";

import { PlusCircle, FileText, Sparkles, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: PlusCircle,
    title: "Add Your Job Application",
    description:
      "Start by adding a new job application with company details, job title, and application date. Keep all your opportunities organized in one place.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Upload or Create Your Resume",
    description:
      "Upload your existing resume or build one using our structured resume builder. Manage multiple resume versions for different job types.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Get AI-Powered Match Score",
    description:
      "Use our AI matching feature to compare your resume with job descriptions. Receive detailed match scores and personalized recommendations.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track Your Progress",
    description:
      "Monitor your job search progress with interactive dashboards. Track application status, interview schedules, and success metrics.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="w-full bg-white py-20 md:py-32">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-[#059861] uppercase tracking-wider px-4 py-2 bg-[#059861]/10 rounded-full">
              Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get started in minutes and transform your job search with our simple, powerful workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#059861] to-[#06b875] shadow-lg">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {step.description}
                  </p>
                </div>
                {!isLast && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#059861] to-[#06b875] -z-10">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 text-[#059861]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-[#059861] hover:bg-[#047a4d] text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
















