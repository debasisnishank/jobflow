"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SubscriptionPlan } from "@/lib/subscription-plans";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CheckoutButtonProps {
  planId: SubscriptionPlan;
  planName: string;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "secondary" | "outline";
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    email: string;
    name: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
  error?: (response: { error: { description: string } }) => void;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function CheckoutButton({
  planId,
  planName,
  disabled = false,
  className = "",
  variant = "default",
}: CheckoutButtonProps) {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script on mount
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "Failed to load payment gateway. Please refresh and try again.",
        });
      };
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const handleCheckout = async () => {
    if (planId === "free") {
      toast({
        title: "Free Plan",
        description: "You are already on the free plan.",
      });
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      toast({
        variant: "destructive",
        title: "Payment Gateway",
        description: "Payment gateway is still loading. Please wait...",
      });
      return;
    }

    try {
      // Call our API to create order
      const response = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const { orderId, amount, currency, keyId, userEmail, userName } = data;

      if (!keyId || !orderId) {
        throw new Error("Invalid order response from server");
      }

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: keyId,
        amount: String(amount),
        currency,
        name: "JobFlow",
        description: `${planName} Plan Subscription`,
        order_id: orderId,
        prefill: {
          email: userEmail,
          name: userName || userEmail.split("@")[0],
        },
        handler: async (razorpayResponse: RazorpayResponse) => {
          // Payment successful - redirect to billing page
          // The webhook will handle the actual subscription activation
          window.location.href = `/dashboard/billing?success=true&payment_id=${razorpayResponse.razorpay_payment_id}`;
        },
        modal: {
          ondismiss: () => {
            // User closed the modal
            window.location.href = "/dashboard/pricing?canceled=true";
          },
        },
        theme: {
          color: "#3B82F6",
        },
        error: (error) => {
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: error.error?.description || "Payment could not be processed.",
          });
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: errorMessage,
      });
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || !razorpayLoaded || planId === "free"}
      className={className}
      variant={variant}
    >
      {!razorpayLoaded ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : planId === "free" ? (
        "Current Plan"
      ) : (
        `Subscribe to ${planName}`
      )}
    </Button>
  );
}
