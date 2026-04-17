"use client";

import { useEffect, useState } from "react";

interface DashboardContentProps {
  children: React.ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkSidebarState = () => {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    };

    checkSidebarState();

    // Listen for custom event when sidebar toggles
    const handleSidebarToggle = () => {
      checkSidebarState();
    };

    window.addEventListener("sidebar-toggle", handleSidebarToggle);
    // Also check periodically for same-tab updates
    const interval = setInterval(checkSidebarState, 100);

    return () => {
      window.removeEventListener("sidebar-toggle", handleSidebarToggle);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`flex flex-col sm:gap-4 transition-all duration-300 pt-20 sm:pt-4 ml-0 ${isCollapsed ? 'sm:ml-[80px]' : 'sm:ml-[272px]'
        }`}
    >
      {children}
    </div>
  );
}

