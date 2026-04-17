"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authenticate } from "@/actions/auth.actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SigninFormSchema } from "@/models/signinForm.schema";
import Loading from "../Loading";
import Link from "next/link";
import { Eye, EyeOff, Sparkles, CheckCircle2, XCircle, Mail } from "lucide-react";

function SigninForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState<string>("/dashboard");
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    mode: "onChange",
  });

  const [errorMessage, setError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Get callback URL from query params
  useEffect(() => {
    const urlCallback = searchParams.get("callbackUrl");
    if (urlCallback) {
      setCallbackUrl(decodeURIComponent(urlCallback));
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    const email = form.getValues("email");
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage(data.message || "Verification email sent! Please check your inbox.");
        setError(""); // Clear error when success
        setShowResendVerification(false);
      } else {
        setError(data.message || "Failed to send verification email");
      }
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const onSubmit = (data: z.infer<typeof SigninFormSchema>) => {
    setError("");
    setSuccessMessage("");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);
      const errorResponse = await authenticate("", formData);
      if (!!errorResponse) {
        if (errorResponse === "EMAIL_NOT_VERIFIED") {
          setError("Your email address is not verified yet.");
          setShowResendVerification(true);
        } else {
          setError(errorResponse);
          setShowResendVerification(false);
        }
      } else {
        router.push(callbackUrl);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-sm font-semibold text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="id@example.com"
                      {...field}
                      className="bg-white/50 border-gray-200/60 backdrop-blur-sm focus:border-emerald-500 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="password" className="text-sm font-semibold text-gray-700">Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="pr-10 bg-white/50 border-gray-200/60 backdrop-blur-sm focus:border-emerald-500 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-500 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6 shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all duration-200 border border-white/20"
            >
              {isPending ? <Loading size="sm" color="white" /> : (
                <span className="flex items-center gap-2">
                  Sign in
                  <Sparkles className="h-4 w-4" />
                </span>
              )}
            </Button>

            {successMessage && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="mt-0.5 p-1 rounded-full bg-green-100/50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm text-green-800 font-medium leading-relaxed">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 rounded-full bg-red-100/50">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-semibold mb-1">{errorMessage}</p>
                    {showResendVerification && (
                      <p className="text-xs text-red-600/80 leading-relaxed">
                        Check your inbox for the verification link, or request a new one below.
                      </p>
                    )}
                  </div>
                </div>

                {showResendVerification && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={resending}
                    className="w-full bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300 transition-all font-medium py-5"
                    onClick={handleResendVerification}
                  >
                    {resending ? (
                      <Loading size="sm" color="inherit" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Resend Verification Email
                      </span>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}

export default SigninForm;
