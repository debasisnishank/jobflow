import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "inherit";
}

const Loading = ({ className, size = "md", color = "inherit" }: LoadingProps) => {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 48,
  };

  const colorMap = {
    primary: "text-[#3B82F6]",
    white: "text-white",
    inherit: "text-current",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader className={cn("animate-spin", colorMap[color])} size={sizeMap[size]} />
    </div>
  );
};

export default Loading;
