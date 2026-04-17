"use client";
import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { CurrentUser } from "@/models/user.model";
import { Toaster } from "@/components/ui/toaster";

interface AdminLayoutProps {
  children: ReactNode;
  user: CurrentUser | null;
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50/50">
      <AdminSidebar user={user} />
      <main className="ml-0 sm:ml-[272px] transition-all duration-300 flex-1 px-4 pt-20 pb-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
