"use client";

import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogoProps } from "./BrandLogo.types";
import { useAppConfigContext } from "@/contexts/AppConfigContext";

const sizeMap = {
  sm: { container: "w-7 h-7", icon: "w-4 h-4", text: "text-base" },
  md: { container: "w-8 h-8", icon: "w-4.5 h-4.5", text: "text-lg" },
  lg: { container: "w-10 h-10", icon: "w-5 h-5", text: "text-xl" },
};

export function BrandLogo({
  className,
  showText = true,
  size = "md",
  useDynamicConfig = true,
}: BrandLogoProps) {
  const sizes = sizeMap[size];
  const { config } = useAppConfigContext();
  const brandName = useDynamicConfig ? config.brandName : "JobFlow";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn(sizes.container, "rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0")}>
        <Briefcase className={cn(sizes.icon, "text-white")} />
      </div>
      {showText && (
        <span className={cn("font-bold text-gray-900", sizes.text)}>
          {brandName}
        </span>
      )}
    </div>
  );
}
