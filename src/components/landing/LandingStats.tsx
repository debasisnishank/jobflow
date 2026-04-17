"use strict";

import { Briefcase, FileText, TrendingUp, Users, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    value: "10,000+",
    label: "Job Applications",
    description: "Tracked and managed",
  },
  {
    icon: FileText,
    value: "50,000+",
    label: "Resumes Analyzed",
    description: "AI-powered insights",
  },
  {
    icon: TrendingUp,
    value: "85%",
    label: "Match Improvement",
    description: "Average score increase",
  },
  {
    icon: Users,
    value: "5,000+",
    label: "Active Users",
    description: "Growing community",
  },
];

export function LandingStats() {
  return (
    <section className="w-full relative py-20 md:py-32 overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#059861]/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#059861]" />
            <span className="text-sm font-semibold text-[#059861] uppercase tracking-wider px-4 py-2 bg-[#059861]/10 rounded-full">
              Impact
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Trusted by Job Seekers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who are taking control of their job search journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative"
              >
                {/* Subtle hover glow */}
                <div className="absolute -inset-0.5 bg-[#059861]/5 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                
                <div className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#059861]/20 transition-all duration-300 transform hover:-translate-y-1">
                  {/* Icon with professional styling */}
                  <div className="mb-6 relative inline-flex h-16 w-16 items-center justify-center rounded-xl bg-[#059861]/10 group-hover:bg-[#059861]/15 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-[#059861]" />
                  </div>
                  
                  {/* Stat value */}
                  <div className="text-5xl md:text-6xl font-extrabold mb-3 text-gray-900">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {stat.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {stat.description}
                  </div>
                  
                  {/* Professional accent line */}
                  <div className="mt-6 h-1 w-12 bg-[#059861] rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
