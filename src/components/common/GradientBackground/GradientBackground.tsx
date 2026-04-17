"use client";

import { cn } from "@/lib/utils";
import { GradientBackgroundProps } from "./GradientBackground.types";

const variantMap = {
  primary: "gradient-bg-primary",
  subtle: "gradient-bg-subtle",
  card: "gradient-bg-card",
};

const positionMap = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

export function GradientBackground({
  children,
  className,
  variant = "subtle",
  position = "top-left",
}: GradientBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute h-96 w-96 rounded-full opacity-20 blur-3xl",
          variantMap[variant],
          positionMap[position]
        )}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
