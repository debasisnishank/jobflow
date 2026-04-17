"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Briefcase } from "lucide-react";
import {
  SheetClose,
  SheetContent,
} from "@/components/ui/sheet";
import { SIDEBAR_GROUPS } from "@/lib/constants";
import { appConfig } from "@/lib/config/app.config";

export function HeaderMobileMenu() {
  return (
    <SheetContent side="left" className="sm:max-w-xs">
      <nav className="grid gap-6 text-lg font-medium">
        <SheetClose asChild>
          <Link href="/" className="px-2 block">
            <BrandLogo size="md" />
          </Link>
        </SheetClose>
        {SIDEBAR_GROUPS.map((group, groupIndex) => (
          <div key={group.label || groupIndex} className="space-y-2">
            {group.label && (
              <div className="px-2.5 py-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </span>
              </div>
            )}
            {group.items.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center gap-4 px-2.5 text-muted-foreground font-semibold">
                      <item.icon className="h-5 w-5" />
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.badge && (
                          <span className="rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="ml-9 space-y-1">
                      {item.children.map((child) => (
                        <SheetClose asChild key={child.label}>
                          <Link
                            href={child.route || "#"}
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground text-sm"
                          >
                            <child.icon className="h-4 w-4" />
                            {child.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <SheetClose asChild key={item.label}>
                  <Link
                    href={item.route || "#"}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        ))}
      </nav>
    </SheetContent>
  );
}









