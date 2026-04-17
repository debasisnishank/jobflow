"use client";

import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UpdateUserProfileFormSchema } from "@/models/updateUserProfileForm.schema";
import { z } from "zod";
import { Loader } from "lucide-react";

interface ProfileSettingsContentProps {
  formData: z.infer<typeof UpdateUserProfileFormSchema>;
  setFormData: (data: z.infer<typeof UpdateUserProfileFormSchema>) => void;
  onSave: () => void;
  isPending: boolean;
}

export function ProfileSettingsContent({
  formData,
  setFormData,
  onSave,
  isPending,
}: ProfileSettingsContentProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="profile-name" className="text-sm font-medium">
          Name
        </Label>
        <Input
          id="profile-name"
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Enter your name"
          className="w-full border-border/60"
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Your display name as it appears in the application.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="profile-email"
          type="email"
          value={formData.email}
          placeholder="Enter your email"
          className="w-full border-border/60 bg-muted cursor-not-allowed"
          disabled={true}
          readOnly={true}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Email address cannot be changed. Contact support if you need to update your email.
        </p>
      </div>
      <div className="pt-4">
        <Button
          className="min-w-[120px] bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white hover:from-[#2563EB] hover:to-[#1E3A8A] shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={onSave}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}

