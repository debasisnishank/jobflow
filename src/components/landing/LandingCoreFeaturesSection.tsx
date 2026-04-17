"use strict";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

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
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#059861]/10 flex items-center justify-center">
        <Check className="w-5 h-5 text-[#059861]" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2 text-lg">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#059861]/20 to-[#06b875]/20 rounded-2xl blur-2xl opacity-50"></div>
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
      <div className="space-y-2">
        <span className="inline-block text-sm font-semibold text-[#059861] uppercase tracking-wider">
          {badge}
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
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
          className="bg-[#059861] hover:bg-[#047a4d] text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
        >
          Get Started Free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}

export function FeatureSection({ badge, title, features, imageSrc, imageAlt, imageOrder = "right" }: FeatureSectionProps) {
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

export function SectionDivider() {
  return (
    <div className="flex items-center justify-center my-16 md:my-20">
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </div>
  );
}

export function SectionHeading() {
  return (
    <div className="text-center mb-16 md:mb-20">
      <div className="inline-block mb-4">
        <span className="text-sm font-semibold text-[#059861] uppercase tracking-wider px-4 py-2 bg-[#059861]/10 rounded-full">
          Features
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
        Core Feature Highlights
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Powerful AI-driven tools to help you land your dream job faster
      </p>
    </div>
  );
}
















