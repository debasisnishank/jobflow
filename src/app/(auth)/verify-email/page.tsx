"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/common/BrandLogo";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"loading" | "success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resendMessage, setResendMessage] = useState("");
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing");
      return;
    }

    if (verificationStarted.current) return;
    verificationStarted.current = true;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to verify email");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while verifying your email");
      }
    });
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setResendStatus("loading");
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setResendStatus("success");
        setResendMessage(data.message || "Verification email sent!");

        // If already verified, redirect to sign-in
        if (data.message?.includes("already verified")) {
          setTimeout(() => {
            router.push("/signin");
          }, 1500);
        }
      } else {
        setResendStatus("error");
        setResendMessage(data.message || "Failed to send email");
      }
    } catch (err) {
      setResendStatus("error");
      setResendMessage("Failed to send verification email. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col items-center">
          <BrandLogo size="lg" showText={true} useDynamicConfig={true} />
        </div>

        <Card className="border-none shadow-2xl shadow-gray-200/50 overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 w-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8]" />
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900">Email Verification</CardTitle>
            <CardDescription className="text-gray-500">
              {isPending
                ? "Verifying your link..."
                : status === "success"
                  ? "Experience the full potential of your account"
                  : status === "error"
                    ? "There was a problem verifying your account"
                    : "Checking your verification status..."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-10">
            {isPending ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-4 border-[#3B82F6]/10" />
                  <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-4 border-[#3B82F6] border-t-transparent animate-spin" />
                  <Mail className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-[#3B82F6]" />
                </div>
                <p className="mt-6 text-sm font-medium text-gray-600 animate-pulse">
                  Authenticating your request...
                </p>
              </div>
            ) : (
              <>
                {status === "success" && (
                  <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                    <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                    <p className="text-gray-600 mb-8">{message}</p>
                    <Link href="/signin" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-6 shadow-lg shadow-green-600/20">
                        Continue to Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                    <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                      <XCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
                    <p className="text-gray-600 mb-6">{message}</p>

                    {resendStatus === "success" ? (
                      <div className="w-full p-4 rounded-xl bg-green-50 border border-green-100 mb-6 text-green-800 text-sm font-medium">
                        {resendMessage}
                      </div>
                    ) : (
                      <>
                        <div className="w-full space-y-3 bg-red-50/50 p-6 rounded-2xl border border-red-100 mb-6 text-left">
                          <p className="text-sm font-semibold text-red-800 mb-2">Request new link:</p>
                          <form onSubmit={handleResend} className="space-y-3">
                            <Input
                              type="email"
                              placeholder="Enter your registered email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="bg-white border-red-100 focus:border-[#3B82F6]"
                            />
                            <Button
                              type="submit"
                              disabled={resendStatus === "loading" || !email}
                              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-6 shadow-lg shadow-[#3B82F6]/20"
                            >
                              {resendStatus === "loading" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Resend Verification Email
                                </span>
                              )}
                            </Button>
                          </form>
                          {resendStatus === "error" && (
                            <p className="mt-2 text-xs text-red-600 font-medium">{resendMessage}</p>
                          )}
                        </div>
                      </>
                    )}

                    <Link href="/signin" className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                      Back to Sign In
                    </Link>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
