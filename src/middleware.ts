import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

function getSubdomain(hostname: string): string | null {
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
}

function isAdminFromToken(session: any): boolean {
  const role = session?.accessToken?.role;
  if (!role) return false;
  const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : "user";
  return normalizedRole === "admin";
}

export default async function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const subdomain = getSubdomain(hostname);
  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");

  if (isAdminRoute) {
    try {
      const session = await auth();

      if (!session?.accessToken) {
        const signInUrl = new URL("/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(signInUrl);
      }

      const userId = session.accessToken.sub as string | undefined;

      if (!userId) {
        const signInUrl = new URL("/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(signInUrl);
      }

      const isAdmin = isAdminFromToken(session);

      if (!isAdmin) {
        const dashboardUrl = new URL("/dashboard", req.url);
        return NextResponse.redirect(dashboardUrl);
      }

      return NextResponse.next();
    } catch (error) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (subdomain === "admin" && !pathname.startsWith("/admin")) {
    const session = await auth();

    if (!session?.accessToken) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const userId = session.accessToken.sub as string | undefined;

    if (!userId) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const isAdmin = isAdminFromToken(session);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    if (!pathname.startsWith("/admin")) {
      const adminUrl = new URL(`/admin${pathname}`, req.url);
      return NextResponse.rewrite(adminUrl);
    }

    return NextResponse.next();
  }

  const session = await auth();
  if (!session && pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
