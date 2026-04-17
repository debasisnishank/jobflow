import "server-only";
import { getCurrentUser } from "@/utils/user.utils";
import { AuthenticationError } from "@/lib/errors";

export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }
  
  if (user.role !== "admin") {
    throw new AuthenticationError("Admin access required", { statusCode: 403 });
  }
  
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}
