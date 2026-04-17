import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppColors } from "@/hooks/useAppColors";

interface NavLinkProps {
  label: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  route: string;
  badge?: string;
  pathname: string;
  match?: "exact" | "prefix";
  isCollapsed?: boolean;
  variant?: "default" | "admin";
}

function NavLink({
  label,
  Icon,
  route,
  badge,
  pathname,
  match = "prefix",
  isCollapsed = false,
  variant = "default",
}: NavLinkProps) {
  const isActive =
    match === "exact"
      ? route === pathname
      : route === pathname || (route !== "/dashboard" && pathname.startsWith(route));
  
  const isAdminVariant = variant === "admin";
  const colors = useAppColors(isAdminVariant);
  
  const primaryColor = isAdminVariant ? colors.primaryColor : "#3B82F6";
  const secondaryColor = isAdminVariant ? colors.secondaryColor : "#1D4ED8";
  
  const getOpacity = (opacity: number) => {
    const hex = opacity.toString(16).padStart(2, "0");
    return hex;
  };
  
  const rgba = (color: string, alpha: number) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return (
    <Tooltip disableHoverableContent={!isCollapsed}>
      <TooltipTrigger asChild>
        <Link
          href={route}
          className={cn(
            "relative flex items-center gap-3 rounded-xl transition-all duration-300 group",
            isCollapsed
              ? "h-10 w-10 justify-center mx-auto"
              : "h-11 w-full px-3",
            !isActive && "text-gray-600"
          )}
          style={
            isActive
              ? {
                  background: `linear-gradient(to right, ${rgba(primaryColor, 0.2)}, ${rgba(primaryColor, 0.1)})`,
                  color: primaryColor,
                  borderColor: rgba(primaryColor, 0.4),
                  borderWidth: "1px",
                  borderStyle: "solid",
                  boxShadow: `0 4px 6px -1px ${rgba(primaryColor, 0.1)}`,
                }
              : {
                  ["--hover-bg" as string]: rgba(primaryColor, 0.1),
                  ["--hover-color" as string]: primaryColor,
                  ["--hover-border" as string]: rgba(primaryColor, 0.3),
                }
          }
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = rgba(primaryColor, 0.1);
              e.currentTarget.style.color = primaryColor;
              e.currentTarget.style.borderColor = rgba(primaryColor, 0.3);
              e.currentTarget.style.borderWidth = "1px";
              e.currentTarget.style.borderStyle = "solid";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6B7280";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}
        >
          {isActive && !isCollapsed && (
            <span
              className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full shadow-sm"
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
              }}
            />
          )}
          <div
            className={cn(
              "flex items-center justify-center rounded-lg transition-all duration-300",
              isActive && "shadow-sm",
              !isActive && "bg-transparent"
            )}
            style={
              isActive
                ? {
                    backgroundColor: rgba(primaryColor, 0.15),
                  }
                : undefined
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = rgba(primaryColor, 0.05);
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <Icon
              className={cn("h-5 w-5 flex-shrink-0 transition-all duration-300", {
                "scale-110": isActive,
                "group-hover:scale-110": !isActive,
              })}
              style={{
                color: isActive ? primaryColor : undefined,
              }}
            />
          </div>
          {!isCollapsed && (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium truncate transition-colors duration-300",
                  isActive && "font-semibold"
                )}
                style={{
                  color: isActive ? primaryColor : undefined,
                }}
              >
                {label}
              </span>
              {badge && (
                <span
                  className="shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    borderColor: rgba(primaryColor, 0.35),
                    backgroundColor: rgba(primaryColor, 0.08),
                    color: primaryColor,
                  }}
                  aria-label={`${label} ${badge}`}
                >
                  {badge}
                </span>
              )}
            </div>
          )}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="font-medium bg-gray-900 text-white rounded-lg">
          {badge ? `${label} (${badge})` : label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export default NavLink;
