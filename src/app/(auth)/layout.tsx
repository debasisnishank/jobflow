"use client";

import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

const Threads = dynamic(() => import("@/components/ui/Threads"), {
  ssr: false,
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Threads
            color={[0.23, 0.51, 0.96]}
            amplitude={1.5}
            distance={0.15}
            enableMouseInteraction={true}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-blue-50/30 to-white/50 z-0" />

        {/* Content */}
        <main className="relative z-10 w-full px-4">
          {children}
        </main>
      </div>
      <Toaster />
    </SessionProvider>
  );
}
