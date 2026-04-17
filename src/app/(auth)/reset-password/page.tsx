import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";
import { BrandLogo } from "@/components/common/BrandLogo";

export const metadata: Metadata = {
  title: "Reset Password",
};

function ResetPasswordContent() {
  return (
    <div className="mx-auto max-w-md w-full">
      {/* Glass Card */}
      <Card className="relative border-[#3B82F6]/20 bg-white/70 backdrop-blur-2xl shadow-xl shadow-blue-500/10 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        
        <CardHeader className="relative space-y-4 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="transition-transform hover:scale-105 duration-200">
              <BrandLogo size="lg" />
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Create a new password for your account. Make sure it&apos;s strong and secure.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative">
          <Link
            href="/signin"
            className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#3B82F6] transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Sign In
          </Link>
          
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md w-full">
        <Card className="relative border-[#3B82F6]/20 bg-white/70 backdrop-blur-2xl shadow-xl shadow-blue-500/10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription>
              Loading...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}










