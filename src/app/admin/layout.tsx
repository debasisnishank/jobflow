import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCurrentUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/admin");
  }

  const userRole = user.role || "user";
  
  if (userRole !== "admin") {
    redirect("/dashboard");
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
