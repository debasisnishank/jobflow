import { UsersTable } from "@/components/admin/users/UsersTable";
import { getCurrentUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage users and their roles
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
