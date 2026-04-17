import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ValidationError, DatabaseError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Verification token is required" },
        { status: 400 }
      );
    }

    let decodedToken = token;
    try {
      decodedToken = decodeURIComponent(token);
    } catch {
      decodedToken = token;
    }

    console.log("Verifying token. Length:", decodedToken.length, "First 20 chars:", decodedToken.substring(0, 20));

    try {
      const user = await (prisma.user as any).findFirst({
        where: {
          emailVerificationToken: decodedToken,
        },
      });

      if (!user) {
        console.error("Verification token not found in database:", decodedToken);
        return NextResponse.json(
          { success: false, message: "Invalid verification link. The link may have already been used or is incorrect." },
          { status: 400 }
        );
      }

      const userAny = user as any;

      // Check if already verified BEFORE checking expiry
      if (userAny.emailVerified) {
        return NextResponse.json(
          { success: true, message: "Email is already verified" },
          { status: 200 }
        );
      }

      const now = new Date();
      if (userAny.emailVerificationExpires) {
        const expiresDate = new Date(userAny.emailVerificationExpires);
        if (expiresDate < now) {
          console.error("Token expired. Expires:", expiresDate, "Now:", now);
          return NextResponse.json(
            { success: false, message: "Verification token has expired. Please request a new verification email." },
            { status: 400 }
          );
        }
      }

      await (prisma.user.update as any)({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });
    } catch (prismaError: any) {
      console.error("Prisma error during verification:", prismaError);
      if (prismaError.code === "P2025" || prismaError.message?.includes("Unknown field") || prismaError.message?.includes("emailVerificationToken")) {
        return NextResponse.json(
          { success: false, message: "Database schema needs to be updated. Please run: npx prisma generate && npx prisma db push" },
          { status: 500 }
        );
      }
      throw prismaError;
    }

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
