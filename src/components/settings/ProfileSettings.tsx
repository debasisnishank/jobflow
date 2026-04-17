"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "../ui/use-toast";
import { ProfileSettingsContent } from "./ProfileSettingsContent";
import { CurrentUser } from "@/models/user.model";
import { updateUserProfile } from "@/actions/user.actions";
import { useTransition } from "react";
import { UpdateUserProfileFormSchema } from "@/models/updateUserProfileForm.schema";
import { z } from "zod";

interface ProfileSettingsProps {
  user: CurrentUser | null;
}

function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<z.infer<typeof UpdateUserProfileFormSchema>>({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!formData.name || !formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid name.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User information not available. Please refresh the page.",
      });
      return;
    }

    startTransition(async () => {
      const result = await updateUserProfile(formData);
      if (result?.success && result?.data) {
        // Update local state with the returned data immediately
        setFormData({
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
        });
        // Refresh the router to update server components
        router.refresh();
        toast({
          variant: "success",
          title: "Saved!",
          description: "Profile information updated successfully.",
        });
      } else {
        const errorMessage = result?.message || "Failed to update profile.";
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    });
  };

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Profile Information
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Update your personal information and account details
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ProfileSettingsContent
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  );
}

export default ProfileSettings;

