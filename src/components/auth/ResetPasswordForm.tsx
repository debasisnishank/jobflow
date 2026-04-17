"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "@/actions/auth.actions";
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
import { useState, useTransition } from "react";
import { ResetPasswordFormSchema } from "@/models/resetPasswordForm.schema";
import Loading from "../Loading";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Sparkles } from "lucide-react";

function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof ResetPasswordFormSchema>) => {
    if (!token) {
      setErrorMessage("Invalid reset token. Please request a new password reset.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    startTransition(async () => {
      try {
        const result = await resetPassword(token, data.password);
        if (result.success) {
          setSuccessMessage(result.message);
          setTimeout(() => {
            router.push("/signin");
          }, 2000);
        } else {
          setErrorMessage(result.message);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to reset password. Please try again."
        );
      }
    });
  };

  if (!token) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Invalid or missing reset token
          </p>
          <p className="mt-1 text-sm text-red-600">
            The password reset link is invalid or has expired. Please request a new password reset.
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB] transition-colors underline-offset-4 hover:underline"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password" className="text-sm font-semibold text-gray-700">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        {...field}
                        className="pr-10 bg-white/50 border-gray-200/60 backdrop-blur-sm focus:border-[#3B82F6] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3B82F6] transition-colors"
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
                  <p className="text-xs text-gray-500">
                    Must be at least 6 characters long
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        {...field}
                        className="pr-10 bg-white/50 border-gray-200/60 backdrop-blur-sm focus:border-[#3B82F6] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3B82F6] transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
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
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-600">
                {errorMessage}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-medium text-green-600">
                {successMessage}
              </p>
              <p className="mt-1 text-xs text-green-600">
                Redirecting to sign in page...
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending || !!successMessage}
            className="w-full mt-2 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white font-semibold py-6 shadow-lg shadow-[#3B82F6]/30 hover:shadow-xl transition-all duration-200 border border-white/20"
          >
            {isPending ? <Loading size="sm" color="white" /> : (
              <span className="flex items-center gap-2">
                Reset Password
                <Lock className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default ResetPasswordForm;

