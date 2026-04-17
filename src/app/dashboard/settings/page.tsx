import AiSettings from "@/components/settings/AiSettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import { getCurrentUser } from "@/utils/user.utils";
import React from "react";

async function Settings() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col col-span-3 space-y-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold leading-none tracking-tight mb-2">
          Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure your application preferences
        </p>
      </div>
      <ProfileSettings user={user} />
      <AiSettings />
    </div>
  );
}

export default Settings;
