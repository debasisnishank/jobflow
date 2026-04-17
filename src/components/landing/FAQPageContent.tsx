"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, HelpCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppConfigContext } from "@/contexts/AppConfigContext";
import { SubscriptionPlanConfig } from "@/lib/subscription-plans";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

function getFAQs(brandName: string, freePlan?: SubscriptionPlanConfig, supportEmail?: string): FAQItem[] {
  const freePlanJobs = freePlan?.limits.jobs === -1 ? "Unlimited" : (freePlan?.limits.jobs ?? 10);
  const freePlanResumes = freePlan?.limits.resumes === -1 ? "Unlimited" : (freePlan?.limits.resumes ?? 1);
  const freeTrialDays = 14;
  const refundDays = 30;
  const responseTime = "24-48 hours";
  const priorityResponseTime = "Faster response times";
  return [
  {
    category: "General",
    question: `What is ${brandName}?`,
    answer: `${brandName} is a comprehensive job application tracking system that helps you manage your entire job search journey. From tracking applications to AI-powered resume reviews and interview preparation, we provide all the tools you need to succeed.`,
  },
  {
    category: "General",
    question: "How do I get started?",
    answer: "Getting started is easy! Simply sign up for a free account, and you'll have immediate access to our free plan. You can start tracking job applications right away, and upgrade to a paid plan when you're ready for more advanced features.",
  },
  {
    category: "Features",
    question: "What features are included in the free plan?",
    answer: `The free plan includes basic job application tracking, limited resume storage, and access to our core features. You can track up to ${freePlanJobs} job applications and store ${freePlanResumes} resume${freePlanResumes !== 1 ? "s" : ""}. Perfect for getting started with your job search!`,
  },
  {
    category: "Features",
    question: "What is AI Job Matching?",
    answer: "AI Job Matching uses advanced algorithms to analyze your resume and compare it with job descriptions. You'll receive a match score and detailed feedback on how well your resume aligns with each job, helping you identify the best opportunities.",
  },
  {
    category: "Features",
    question: "How does the AI Mock Interview work?",
    answer: "Our AI Mock Interview feature provides realistic interview practice with 28+ different scenarios. You can practice via video calls, receive real-time feedback, and get AI-powered analysis of your performance. It's like having a personal interview coach available 24/7.",
  },
  {
    category: "Features",
    question: "Can I manage multiple resumes?",
    answer: "Yes! Depending on your plan, you can store and manage multiple resume versions. This is perfect for tailoring your resume to different types of jobs or industries. Premium plans offer unlimited resume storage.",
  },
  {
    category: "Pricing",
    question: "Can I change plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle. If you upgrade, you'll get immediate access to the new features. If you downgrade, you'll continue to have access to your current plan features until the end of your billing period.",
  },
  {
    category: "Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and debit cards through our secure payment processor. All payments are processed securely and we never store your full payment information.",
  },
  {
    category: "Pricing",
    question: "Is there a free trial?",
    answer: `Yes! All paid plans come with a ${freeTrialDays}-day free trial. No credit card required to start. You can explore all the features of your chosen plan risk-free. If you're not satisfied, simply cancel before the trial ends.`,
  },
  {
    category: "Pricing",
    question: "Can I cancel anytime?",
    answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access to all paid features until the end of your current billing period. No questions asked.",
  },
  {
    category: "Pricing",
    question: "Do you offer refunds?",
    answer: `We offer a ${freeTrialDays}-day free trial for all paid plans, so you can try before you buy. If you're not satisfied within the first ${refundDays} days of a paid subscription, contact our support team and we'll work with you to resolve any issues.`,
  },
  {
    category: "Security",
    question: "Is my data secure?",
    answer: "Yes, security is our top priority. We use industry-standard encryption to protect your data, and we're self-hosted, meaning you have full control over your information. We never share your data with third parties without your explicit consent.",
  },
  {
    category: "Security",
    question: "What happens to my data if I cancel?",
    answer: "Your data remains accessible to you even after cancellation. You can export all your data at any time. If you delete your account, all your personal data will be permanently removed within 30 days, in accordance with our privacy policy.",
  },
  {
    category: "Support",
    question: "What kind of support do you offer?",
    answer: "All plans include email support. Pro and Enterprise plans include priority support with faster response times. We also have comprehensive documentation and tutorials to help you get the most out of the platform.",
  },
  {
    category: "Support",
    question: "How can I contact support?",
    answer: `You can reach our support team by emailing ${supportEmail || "support@jobflow.app"}. We typically respond within ${responseTime}. Priority support customers receive ${priorityResponseTime}.`,
  },
  {
    category: "Technical",
    question: "Do you have a mobile app?",
    answer: "Currently, we're a web-based application that works great on mobile browsers. We're actively working on native mobile apps for iOS and Android, which will be available soon.",
  },
  {
    category: "Technical",
    question: "What browsers are supported?",
    answer: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser.",
  },
  {
    category: "Technical",
    question: "Can I export my data?",
    answer: "Yes! You can export all your data at any time. This includes your job applications, resumes, contacts, and interview history. We provide data in standard formats (CSV, JSON) for easy import into other tools.",
  },
  ];
}

const categories = ["All", "General", "Features", "Pricing", "Security", "Support", "Technical"];

export function FAQPageContent() {
  const { config } = useAppConfigContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [freePlan, setFreePlan] = useState<SubscriptionPlanConfig | undefined>(undefined);

  useEffect(() => {
    const fetchFreePlan = async () => {
      try {
        const response = await fetch("/api/plans");
        const data = await response.json();
        if (data.success && data.plans?.free) {
          setFreePlan(data.plans.free);
        }
      } catch (error) {
        console.error("Failed to fetch free plan:", error);
      }
    };

    fetchFreePlan();
  }, []);
  
  const faqs = getFAQs(config.brandName, freePlan, config.supportEmail);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <HelpCircle className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            How Can We Help?
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about {config.brandName} features, pricing, and more.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="w-full bg-white border-b py-8">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
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
      </div>

      {/* FAQ Content */}
      <div className="w-full bg-white py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No FAQs found matching your search.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <div className="mt-12 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Still have questions?</h2>
              <p className="text-gray-600">
                Can't find the answer you're looking for? We're here to help!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href={`mailto:${config.supportEmail}`}>
                <Button size="lg" variant="outline" className="gap-2">
                  Email Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


