import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { User } from "./models/user.model";
import prisma from "./lib/db";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        emailVerified: true,
      },
    });
    if (!user || !user.password) {
      return undefined;
    }
    return user as User & { role?: string };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          token.role = dbUser?.role || "user";
        } catch (error) {
          console.error("Error fetching user role for JWT:", error);
          token.role = "user";
        }
      }
      return token;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            // Email verification check disabled for development
            // const dbUser = await prisma.user.findUnique({
            //   where: { email: email.toLowerCase().trim() },
            //   select: { emailVerified: true },
            // });
            // if (!dbUser?.emailVerified) {
            //   throw new Error("EMAIL_NOT_VERIFIED");
            // }
            return user;
          }
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
