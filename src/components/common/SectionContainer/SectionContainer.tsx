import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  id?: string;
  children: ReactNode;
  background?: "white" | "gray" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const backgroundClasses = {
  white: "bg-white",
  gray: "bg-gray-50",
  gradient: "bg-gradient-to-b from-white to-gray-50",
};

const paddingClasses = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-20 md:py-32",
};

export function SectionContainer({
  id,
  children,
  background = "white",
  padding = "lg",
  className,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full",
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <div className="container px-4 md:px-6">
        {children}
      </div>
    </section>
  );
}
