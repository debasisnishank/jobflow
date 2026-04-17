"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactInfoFormProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    headline: string;
  };
  onChange: (data: ContactInfoFormProps["data"]) => void;
}

export function ContactInfoForm({ data, onChange }: ContactInfoFormProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Information</h3>
        <p className="text-sm text-gray-600">
          Your basic contact details that will appear at the top of your resume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="John"
            className="bg-white border-gray-300 focus:border-[#3B82F6]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Doe"
            className="bg-white border-gray-300 focus:border-[#3B82F6]"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline" className="text-sm font-medium">
          Professional Headline <span className="text-red-500">*</span>
        </Label>
        <Input
          id="headline"
          value={data.headline}
          onChange={(e) => handleChange("headline", e.target.value)}
          placeholder="Senior Software Engineer | Full Stack Developer"
          className="bg-white border-gray-300 focus:border-[#3B82F6]"
          required
        />
        <p className="text-xs text-gray-500">
          A brief title that describes your professional identity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john.doe@email.com"
            className="bg-white border-gray-300 focus:border-[#3B82F6]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="bg-white border-gray-300 focus:border-[#3B82F6]"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Address
        </Label>
        <Textarea
          id="address"
          value={data.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="123 Main Street, City, State 12345"
          rows={2}
          className="bg-white border-gray-300 focus:border-[#3B82F6]"
        />
        <p className="text-xs text-gray-500">
          Optional: You can include full address or just city and state
        </p>
      </div>
    </div>
  );
}

