import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import SigninForm from "@/components/auth/SigninForm";
import { BrandLogo } from "@/components/common/BrandLogo";
import { getAppConfigFromDB } from "@/lib/admin/app-config.server";
import { appConfig as staticConfig } from "@/lib/config/app.config";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let config = staticConfig;
  try {
    config = await getAppConfigFromDB();
  } catch (error) {
    config = staticConfig;
  }
  return {
    title: `Sign in - ${config.brandName}`,
  };
}

interface SigninProps {
  searchParams: { callbackUrl?: string; verifyEmail?: string; resendVerification?: string };
}

export default async function Signin({ searchParams }: SigninProps) {
  const session = await auth();
  
  // Redirect to callback URL or dashboard if user is already logged in
  if (session?.user) {
    const callbackUrl = searchParams.callbackUrl 
      ? decodeURIComponent(searchParams.callbackUrl)
      : "/dashboard";
    redirect(callbackUrl);
  }
  return (
    <div className="mx-auto max-w-md w-full">
      {/* Glass Card */}
      <Card className="relative border-[emerald-500]/20 bg-white/70 backdrop-blur-2xl shadow-xl shadow-emerald-500/10 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        
        <CardHeader className="relative space-y-4 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="transition-transform hover:scale-105 duration-200">
              <BrandLogo size="lg" />
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[emerald-500] to-[teal-500] bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-[emerald-500] transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          
          {(searchParams.verifyEmail === "true" || searchParams.resendVerification === "true") && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">
                {searchParams.verifyEmail === "true" 
                  ? "✓ Verification email sent! Please check your inbox and click the verification link."
                  : "Please verify your email address. You can request a new verification email below."}
              </p>
            </div>
          )}
          
          <SigninForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link 
                href="/signup" 
                className="font-semibold text-[emerald-500] hover:text-[emerald-600] transition-colors underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Bottom text */}
      <p className="mt-6 text-center text-sm text-gray-600">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="font-medium text-[emerald-500] hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-[emerald-500] hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
