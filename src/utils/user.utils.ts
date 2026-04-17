import "server-only";
import { auth } from "@/auth";
import { CurrentUser } from "@/models/user.model";
import prisma from "@/lib/db";

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session?.accessToken) return null;
  const { sub } = session.accessToken;
  if (!sub) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) return null;

    const { iat, exp } = session.accessToken;
    const rawRole = user.role;
    const userRole = (rawRole && typeof rawRole === "string" ? rawRole.trim() : "user").toLowerCase();
    
    const currentUser: CurrentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: userRole === "admin" ? "admin" : "user",
      iat: typeof iat === "number" ? iat : undefined,
      exp: typeof exp === "number" ? exp : undefined,
    };
    return currentUser;
  } catch (error) {
    // Return null on error to maintain backward compatibility with existing code
    // that expects null when user cannot be fetched
    return null;
  }
};
