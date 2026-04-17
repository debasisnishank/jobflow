"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import { Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { signup } from "@/actions/auth.actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { BrandLogo } from "@/components/common/BrandLogo";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .min(3, {
      message: "Email must be at least 3 characters.",
    })
    .email("Please enter a valid email."),
  password: z
    .string({
      required_error: "Please enter your password.",
    })
    .min(6, {
      message: "Password must be at least 6 characters.",
    }),
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [session, status, router]);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  
  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="mx-auto max-w-md w-full flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }
  
  // Don't render form if user is authenticated (will redirect)
  if (status === "authenticated" && session?.user) {
    return null;
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        const result = await signup(data.name, data.email, data.password);
        
        if (result.success) {
          toast({
            variant: "success",
            title: "Account created successfully!",
            description: result.message || "Please check your email to verify your account before signing in.",
          });
          
          setTimeout(() => {
            router.push("/signin?verifyEmail=true");
          }, 1500);
        } else {
          toast({
            variant: "destructive",
            title: "Sign up failed",
            description: result.message || "Please try again.",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again.",
        });
      }
    });
  }

  return (
    <div className="mx-auto max-w-md w-full">
      {/* Glass Card */}
      <Card className="relative border-emerald-500/20 bg-white/70 backdrop-blur-2xl shadow-xl shadow-emerald-500/10 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        
        <CardHeader className="relative space-y-4 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="transition-transform hover:scale-105 duration-200">
              <BrandLogo size="lg" />
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Start your journey with us today
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name" 
                          {...field}
                          className="bg-white/50 border-gray-200/60 backdrop-blur-sm focus:border-[emerald-500] transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="id@example.com" 
                          {...field}
                          className="bg-white/50 border-gray-200/60 backdrop-blur-sm focus:border-[emerald-500] transition-all"
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
                      <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="pr-10 bg-white/50 border-gray-200/60 backdrop-blur-sm focus:border-[emerald-500] transition-all"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[emerald-500] transition-colors"
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
                      Create an account
                      <Sparkles className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                href="/signin" 
                className="font-semibold text-[emerald-500] hover:text-[emerald-600] transition-colors underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Bottom text */}
      <p className="mt-6 text-center text-sm text-gray-600">
        By creating an account, you agree to our{" "}
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
