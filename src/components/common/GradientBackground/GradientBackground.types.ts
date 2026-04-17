export interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "subtle" | "card";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}
