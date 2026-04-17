"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings, ChevronLeft, ChevronRight, Shield, Menu, X } from "lucide-react";
import { SIDEBAR_GROUPS } from "@/lib/constants";
import NavLink from "./NavLink";
import { NavLinkWithChildren } from "./NavLinkWithChildren";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppConfigContext } from "@/contexts/AppConfigContext";
import { useAppColors } from "@/hooks/useAppColors";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CurrentUser } from "@/models/user.model";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderUserMenu } from "./HeaderUserMenu";
import Image from "next/image";

interface SidebarProps {
  user: CurrentUser | null;
}

function Sidebar({ user }: SidebarProps) {
  const { config } = useAppConfigContext();
  const colors = useAppColors(true);
  const path = usePathname();
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const currentPath = (() => {
    const qs = searchParams.toString();
    return qs ? `${path}?${qs}` : path;
  })();

  // Check if we're in the resume builder editor
  const isInResumeEditor = path.includes('/resume-builder/new') ||
    (path.includes('/resume-builder/') && path.split('/').length > 3);

  // Load collapsed state from localStorage or auto-collapse for resume editor
  useEffect(() => {
    if (isInResumeEditor) {
      setIsCollapsed(true);
    } else {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    }
  }, [isInResumeEditor]);

  // Save collapsed state to localStorage (only when not in resume editor)
  useEffect(() => {
    if (!isInResumeEditor) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isInResumeEditor]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new Event("sidebar-toggle"));
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 sm:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-lg border border-gray-200"
        style={{
          borderColor: `${colors.primaryColor}30`,
        }}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" style={{ color: colors.primaryColor }} />
        ) : (
          <Menu className="w-6 h-6" style={{ color: colors.primaryColor }} />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={closeMobileSidebar}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-4 bottom-4 left-4 z-50 flex flex-col border bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 transition-all duration-300 rounded-2xl shadow-2xl",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:via-white/40 before:to-white/60 before:pointer-events-none",
          // Mobile: slide in from left, always full width
          isMobileOpen ? "translate-x-0" : "-translate-x-[110%] sm:translate-x-0",
          // Desktop: always visible with collapse
          "sm:flex",
          // Width: Always w-64 on mobile, collapsible on desktop
          "w-64",
          isCollapsed && "sm:w-16"
        )}
        style={{
          borderColor: `${colors.primaryColor}30`,
          boxShadow: `0 25px 50px -12px ${colors.primaryColor}20`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full relative z-10">
          {/* Logo and Toggle - Fixed at top */}
          <div
            className={cn(
              "flex flex-col gap-3 py-5 shrink-0",
              isCollapsed ? "sm:px-2" : "px-4"
            )}
          >
            <div className={cn(
              "flex items-center gap-2 mb-2",
              isCollapsed ? "sm:flex-col" : "justify-between"
            )}>
              <Link
                href="/dashboard"
                className={cn(
                  "group flex shrink-0 items-center gap-3 transition-all duration-300 hover:scale-105",
                  isCollapsed ? "sm:justify-center sm:w-10" : "flex-1"
                )}
                title={config.brandName}
              >
                {/* Always show full logo on mobile */}
                <div className="sm:hidden">
                  <BrandLogo size="md" />
                </div>
                {/* Conditional logo on desktop */}
                <div className="hidden sm:block">
                  {isCollapsed ? (
                    <div className="transition-transform hover:scale-105">
                      <BrandLogo size="lg" showText={false} />
                    </div>
                  ) : (
                    <BrandLogo size="md" />
                  )}
                </div>
              </Link>
              {/* Hide toggle on mobile, show on desktop */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={cn(
                  "hidden sm:flex h-8 w-8 text-gray-500 transition-all rounded-lg hover:scale-110",
                  isCollapsed && "mt-2"
                )}
                style={{
                  ["--hover-color" as string]: colors.primaryColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.primaryColor;
                  e.currentTarget.style.backgroundColor = `${colors.primaryColor}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation Links - Scrollable */}
          <nav
            className={cn(
              "flex-1 overflow-y-auto overflow-x-hidden pb-4",
              isCollapsed ? "sm:px-2" : "px-4"
            )}
          >
            <div className="flex flex-col gap-4">
              <TooltipProvider delayDuration={300}>
                {SIDEBAR_GROUPS.map((group, groupIndex) => (
                  <div key={group.label || groupIndex} className="flex flex-col gap-1.5">
                    {!isCollapsed && group.label && (
                      <div className="px-3 py-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {group.label}
                        </span>
                      </div>
                    )}
                    {group.items.map((item) => {
                      if (item.children && item.children.length > 0) {
                        return (
                          <NavLinkWithChildren
                            key={item.label}
                            item={item}
                            pathname={currentPath}
                            isCollapsed={isCollapsed}
                          />
                        );
                      }
                      return (
                        <NavLink
                          key={item.label}
                          label={item.label}
                          Icon={item.icon}
                          route={item.route || "#"}
                          badge={item.badge}
                          pathname={currentPath}
                          isCollapsed={isCollapsed}
                        />
                      );
                    })}
                  </div>
                ))}
                {user?.role === "admin" && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    {!isCollapsed && (
                      <div className="px-3 py-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Administration
                        </span>
                      </div>
                    )}
                    <NavLink
                      label="Admin Panel"
                      Icon={Shield}
                      route="/admin"
                      pathname={currentPath}
                      isCollapsed={isCollapsed}
                      variant="admin"
                    />
                  </div>
                )}
              </TooltipProvider>
            </div>
          </nav>

          {/* Settings and User Menu at Bottom */}
          <div
            className={cn(
              "mt-auto border-t bg-gradient-to-t to-transparent py-4 space-y-2 rounded-b-2xl",
              isCollapsed ? "sm:px-2" : "px-4"
            )}
            style={{
              borderColor: `${colors.primaryColor}30`,
              background: `linear-gradient(to top, ${colors.primaryColor}05, transparent)`,
            }}
          >
            <nav className="flex flex-col">
              <TooltipProvider delayDuration={300}>
                <NavLink
                  label="Settings"
                  Icon={Settings}
                  route="/dashboard/settings"
                  pathname={currentPath}
                  isCollapsed={isCollapsed}
                />
              </TooltipProvider>
            </nav>

            {user && (
              <TooltipProvider delayDuration={300}>
                <DropdownMenu>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "relative flex items-center rounded-xl transition-all duration-200 group overflow-hidden w-full",
                            "text-gray-600 hover:shadow-sm",
                            isCollapsed ? "sm:h-10 sm:w-10 sm:justify-center h-12 px-4 gap-3" : "h-12 px-4 gap-3"
                          )}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.primaryColor;
                            e.currentTarget.style.backgroundColor = `${colors.primaryColor}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#6B7280";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-center rounded-lg transition-all duration-200 shrink-0",
                              "group-hover:scale-105",
                              isCollapsed ? "sm:h-8 sm:w-8 h-9 w-9" : "h-9 w-9"
                            )}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${colors.primaryColor}10`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            <div className="relative h-8 w-8">
                              <Image
                                src="/images/placeholder-user.jpg"
                                width={32}
                                height={32}
                                alt={user.name || "Avatar"}
                                className="overflow-hidden rounded-full border-2 border-gray-200 transition-all duration-200 group-hover:ring-2"
                                style={{
                                  borderColor: "rgb(229, 231, 235)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = `${colors.primaryColor}80`;
                                  e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primaryColor}30`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = "rgb(229, 231, 235)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              />
                              <span
                                className="absolute bottom-0 right-0 h-2.5 w-2.5 border-2 border-white rounded-full shadow-sm"
                                style={{
                                  backgroundColor: colors.primaryColor,
                                }}
                              ></span>
                            </div>
                          </div>
                          {!isCollapsed && (
                            <div className="flex flex-col items-start flex-1 min-w-0 sm:hidden">
                              <span className="text-sm font-semibold text-gray-900 truncate w-full">
                                {user.name || "User"}
                              </span>
                              <span className="text-xs text-gray-500 truncate w-full">
                                {user.email}
                              </span>
                            </div>
                          )}
                          {/* Desktop - show based on collapse */}
                          <div className={cn(
                            "hidden sm:flex flex-col items-start flex-1 min-w-0",
                            isCollapsed && "sm:hidden"
                          )}>
                            <span className="text-sm font-semibold text-gray-900 truncate w-full">
                              {user.name || "User"}
                            </span>
                            <span className="text-xs text-gray-500 truncate w-full">
                              {user.email}
                            </span>
                          </div>
                          <span className="sr-only">User menu</span>
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium">
                        {user.name || "User"}
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <HeaderUserMenu
                    userName={user?.name}
                    userEmail={user?.email}
                    align={isCollapsed ? "center" : "start"}
                  />
                </DropdownMenu>
              </TooltipProvider>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
