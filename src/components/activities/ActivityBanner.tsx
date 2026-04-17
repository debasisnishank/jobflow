// components/Banner.tsx
import { AlertCircle, CheckCircle2, CircleStop, XCircle } from "lucide-react";
import { cn, formatElapsedTime } from "@/lib/utils";

type BannerVariant = "success" | "warning" | "error" | "info";

interface BannerProps {
  message: string;
  variant?: BannerVariant;
  onStopActivity: (autoStop: boolean) => void;
  elapsedTime: number;
  className?: string;
}

const variantStyles: Record<BannerVariant, string> = {
  success: "bg-green-400 text-black border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-[#059861]/10 text-[#059861] border-[#059861]/20",
};

const variantIcons: Record<BannerVariant, JSX.Element> = {
  success: <CheckCircle2 className=" text-green-800" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-400" />,
  error: <XCircle className="h-5 w-5 text-red-400" />,
  info: <AlertCircle className="h-5 w-5 text-[#059861]" />,
};

export function ActivityBanner({
  message,
  variant = "success",
  onStopActivity,
  elapsedTime,
  className,
}: BannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 border-2 rounded-xl mb-6 shadow-sm backdrop-blur-sm",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex-shrink-0">{variantIcons[variant]}</div>
      <div className="flex-1">
        <div className="font-semibold text-sm mb-0.5">Active Now</div>
        <div className="font-medium">{message}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs opacity-80 mb-0.5">Elapsed Time</div>
          <div className="font-mono font-bold text-lg">
            {formatElapsedTime(elapsedTime)}
          </div>
        </div>
        <button
          title="Stop Activity"
          type="button"
          className={cn(
            "flex-shrink-0 rounded-lg p-2.5 inline-flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white/20 hover:bg-white/30",
            {
              "focus:ring-green-500": variant === "success",
              "focus:ring-yellow-500": variant === "warning",
              "focus:ring-red-500": variant === "error",
              "focus:ring-[#059861]": variant === "info",
            }
          )}
          onClick={() => onStopActivity(false)}
        >
          <span className="sr-only">Stop Activity</span>
          <CircleStop className="h-5 w-5 text-red-600" />
        </button>
      </div>
    </div>
  );
}
