import { BrandingForm } from "@/components/admin/branding/BrandingForm";
import { getCurrentUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";

export default async function BrandingPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Branding</h1>
        <p className="text-muted-foreground">
          Manage your application branding and appearance
        </p>
      </div>
      <BrandingForm />
    </div>
  );
}
