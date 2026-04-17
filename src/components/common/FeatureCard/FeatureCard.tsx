"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:border-primary/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-[#1D4ED8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative pb-4">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#1D4ED8]/10 group-hover:from-[#3B82F6]/20 group-hover:to-[#1D4ED8]/20 transition-all duration-300">
          <Icon className="h-7 w-7 text-[#3B82F6] group-hover:scale-110 transition-transform duration-300" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#3B82F6] transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <CardDescription className="text-base leading-relaxed text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
