"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SidebarLink } from "@/lib/constants";
import NavLink from "./NavLink";

interface NavLinkWithChildrenProps {
  item: SidebarLink;
  pathname: string;
  isCollapsed: boolean;
}

function matchesRoute(
  pathname: string,
  route: string | undefined,
  match: "exact" | "prefix" = "prefix"
): boolean {
  if (!route) return false;
  return match === "exact" ? pathname === route : pathname.startsWith(route);
}

export function NavLinkWithChildren({ item, pathname, isCollapsed }: NavLinkWithChildrenProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Auto-expand if any child is active
    if (item.children) {
      return item.children.some(
        (child) => matchesRoute(pathname, child.route, child.match)
      );
    }
    return false;
  });

  const hasActiveChild = item.children?.some(
    (child) => matchesRoute(pathname, child.route, child.match)
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "relative flex items-center gap-3 rounded-xl transition-all duration-300 group",
              "text-gray-600 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] hover:shadow-sm",
              "h-10 w-10 justify-center mx-auto"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-lg transition-all duration-300",
                "bg-transparent group-hover:bg-[#3B82F6]/5"
              )}
            >
              <item.icon
                className={cn("h-5 w-5 flex-shrink-0 transition-all duration-300", {
                  "text-[#3B82F6]": hasActiveChild,
                  "group-hover:scale-110 group-hover:text-[#3B82F6]": !hasActiveChild,
                })}
              />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium bg-gray-900 text-white rounded-lg">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "relative flex items-center gap-3 rounded-xl transition-all duration-300 group",
          "text-gray-600 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] hover:shadow-sm",
          "h-11 w-full px-3",
          {
            "hover:border hover:border-[#3B82F6]/30": !hasActiveChild,
          }
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-lg transition-all duration-300",
            "bg-transparent group-hover:bg-[#3B82F6]/5"
          )}
        >
          <item.icon
            className={cn("h-5 w-5 flex-shrink-0 transition-all duration-300", {
              "text-[#3B82F6]": hasActiveChild,
              "group-hover:scale-110 group-hover:text-[#3B82F6]": !hasActiveChild,
            })}
          />
        </div>
        <span
          className={cn(
            "text-sm font-medium truncate transition-colors duration-300 flex-1 text-left",
            hasActiveChild ? "text-[#3B82F6] font-semibold" : "text-gray-700 group-hover:text-gray-900"
          )}
        >
          {item.label}
        </span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500 transition-transform" />
        )}
      </button>

      {isExpanded && item.children && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#3B82F6]/20 pl-3">
          {item.children.map((child) => (
            <NavLink
              key={child.label}
              label={child.label}
              Icon={child.icon}
              route={child.route || "#"}
              pathname={pathname}
              match={child.match}
              isCollapsed={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

