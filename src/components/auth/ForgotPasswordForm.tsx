"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestPasswordReset } from "@/actions/auth.actions";
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
import { ForgotPasswordFormSchema } from "@/models/forgotPasswordForm.schema";
import Loading from "../Loading";
import { Mail } from "lucide-react";

function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof ForgotPasswordFormSchema>) => {
    setErrorMessage("");
    setSuccessMessage("");
    startTransition(async () => {
      try {
        const result = await requestPasswordReset(data.email);
        setSuccessMessage(result.message);
        form.reset();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to send password reset email. Please try again."
        );
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      type="email"
                      placeholder="id@example.com"
                      {...field}
                      className="bg-white/50 border-gray-200/60 backdrop-blur-sm focus:border-[#3B82F6] transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isPending} 
              className="w-full mt-2 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white font-semibold py-6 shadow-lg shadow-[#3B82F6]/30 hover:shadow-xl transition-all duration-200 border border-white/20"
            >
              {isPending ? <Loading size="sm" color="white" /> : (
                <span className="flex items-center gap-2">
                  Send Reset Link
                  <Mail className="h-4 w-4" />
                </span>
              )}
            </Button>
            
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-600 font-medium">{successMessage}</p>
              </div>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}

export default ForgotPasswordForm;










