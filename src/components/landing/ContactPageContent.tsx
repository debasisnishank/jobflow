"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAppConfigContext } from "@/contexts/AppConfigContext";

export function ContactPageContent() {
  const { config } = useAppConfigContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmitted(false);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setError(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <MessageSquare className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Have a question or need help? We're here to assist you. Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="w-full bg-white py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle2 className="h-6 w-6" />
                      <div>
                        <p className="font-semibold">Message sent successfully!</p>
                        <p className="text-sm">We've sent a confirmation email to {formData.email}. We'll get back to you soon.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card className="border-red-200 bg-red-50 mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-red-700">
                      <AlertCircle className="h-6 w-6" />
                      <div>
                        <p className="font-semibold">Error sending message</p>
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
              
              {!isSubmitted && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>
                <p className="text-gray-600 mb-8">
                  Prefer a different method? We're available through multiple channels.
                </p>
              </div>

              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#3B82F6]/10 to-[#1D4ED8]/10">
                      <Mail className="h-6 w-6 text-[#3B82F6]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Email Support</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Send us an email and we'll respond within 24-48 hours.
                  </p>
                  <a
                    href={`mailto:${config.supportEmail}`}
                    className="text-[#3B82F6] hover:underline font-medium"
                  >
                    {config.supportEmail}
                  </a>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#3B82F6]/10 to-[#1D4ED8]/10">
                      <MessageSquare className="h-6 w-6 text-[#3B82F6]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Response Time</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We typically respond to all inquiries within 24-48 hours during business days.
                    Priority support customers receive faster response times.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Need Immediate Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Check out our FAQ page for quick answers to common questions.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="/faq">View FAQ</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

