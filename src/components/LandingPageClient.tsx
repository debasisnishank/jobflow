"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";

function LandingPageContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the user is logged in
    if (status === "authenticated" && session?.user) {
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If authenticated, the redirect will happen, but show children briefly
  return <>{children}</>;
}

export function LandingPageClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LandingPageContent>{children}</LandingPageContent>
    </SessionProvider>
  );
}

