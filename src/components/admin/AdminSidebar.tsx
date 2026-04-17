"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Palette,
  DollarSign,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bot,
  Home,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useAppColors } from "@/hooks/useAppColors";

interface AdminSidebarProps {
  user: { name: string; email: string } | null;
}

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Palette, label: "Branding", href: "/admin/branding" },
  { icon: DollarSign, label: "Pricing Plans", href: "/admin/pricing" },
  { icon: Bot, label: "AI Configuration", href: "/admin/ai-config" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const colors = useAppColors(true);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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

      <aside
        className={cn(
          "fixed top-4 bottom-4 left-4 z-50 flex flex-col border bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 transition-all duration-300 rounded-2xl shadow-2xl",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:via-white/40 before:to-white/60 before:pointer-events-none",
          // Mobile: slide in from left, always full width
          isMobileOpen ? "translate-x-0" : "-translate-x-[110%] sm:translate-x-0",
          // Desktop: always visible (sm:flex)
          "sm:flex",
          // Collapsed state only applies on desktop
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
          <div className={cn("flex flex-col gap-3 py-5 shrink-0", isCollapsed ? "sm:px-2 px-4" : "px-4")}>
            <div className={cn(
              "flex items-center gap-2 mb-2",
              isCollapsed ? "sm:flex-col" : "justify-between"
            )}>
              <Link
                href="/admin"
                className={cn(
                  "group flex shrink-0 items-center gap-3 transition-all duration-300 hover:scale-105",
                  isCollapsed ? "sm:justify-center sm:w-10" : "flex-1"
                )}
                title="Admin Panel"
              >
                {/* Always show full logo on mobile */}
                <div className="sm:hidden">
                  <BrandLogo size="md" showText={true} useDynamicConfig={true} />
                </div>
                <div className="hidden sm:block">
                  {isCollapsed ? (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110"
                      style={{
                        background: `linear-gradient(to bottom right, ${colors.primaryColor}, ${colors.secondaryColor})`,
                        boxShadow: `0 10px 15px -3px ${colors.primaryColor}30`,
                      }}
                    >
                      <BrandLogo size="sm" showText={false} useDynamicConfig={true} />
                    </div>
                  ) : (
                    <BrandLogo size="md" showText={true} useDynamicConfig={true} />
                  )}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={cn(
                  "hidden sm:flex h-8 w-8 text-gray-500 transition-all rounded-lg hover:scale-110",
                  isCollapsed && "mx-auto"
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
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-3">
            <TooltipProvider>
              <ul className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                              isActive
                                ? "shadow-sm"
                                : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900",
                              isCollapsed && "sm:justify-center sm:px-2"
                            )}
                            style={
                              isActive
                                ? {
                                  backgroundColor: `${colors.primaryColor}10`,
                                  color: colors.primaryColor,
                                }
                                : undefined
                            }
                          >
                            <Icon
                              className="h-5 w-5 shrink-0"
                              style={isActive ? { color: colors.primaryColor } : undefined}
                            />
                            <span className={cn(isCollapsed && "sm:hidden")}>{item.label}</span>
                          </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right" className="bg-gray-900 text-white hidden sm:block">
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </TooltipProvider>
          </nav>

          {user && (
            <div className={cn(
              "border-t border-gray-200/80 p-4 shrink-0",
              isCollapsed && "sm:px-2"
            )}>
              <div className={cn(
                "flex items-center gap-3 mb-3",
                isCollapsed && "sm:justify-center"
              )}>
                <div className={cn("flex-1 min-w-0", isCollapsed && "sm:hidden")}>
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href="/dashboard"
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 w-full",
                          "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900",
                          isCollapsed && "sm:justify-center sm:px-2"
                        )}
                        style={{
                          border: `1px solid ${colors.primaryColor}30`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.primaryColor}10`;
                          e.currentTarget.style.color = colors.primaryColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#374151";
                        }}
                      >
                        <Home className="h-4 w-4 shrink-0" />
                        <span className={cn(isCollapsed && "sm:hidden")}>Go to User Dashboard</span>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="bg-gray-900 text-white hidden sm:block">
                        Go to User Dashboard
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                  className={cn(
                    "w-full transition-all",
                    isCollapsed && "sm:w-auto sm:px-2"
                  )}
                  style={{
                    color: colors.primaryColor,
                    borderColor: `${colors.primaryColor}30`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primaryColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className={cn("ml-2", isCollapsed && "sm:hidden")}>Sign Out</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
