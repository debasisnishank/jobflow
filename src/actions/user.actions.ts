"use strict";
"use server";
import prisma from "@/lib/db";
import { handleError } from "@/lib/utils";
import { UpdateUserProfileFormSchema } from "@/models/updateUserProfileForm.schema";
import { getCurrentUser } from "@/utils/user.utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AuthenticationError, ValidationError, DatabaseError } from "@/lib/errors";

export const updateUserProfile = async (
  data: z.infer<typeof UpdateUserProfileFormSchema>
): Promise<any | undefined> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Not authenticated", {
        context: { function: "updateUserProfile" },
      });
    }

    if (user.id !== data.id) {
      throw new AuthenticationError("Unauthorized to update this profile", {
        context: { function: "updateUserProfile", userId: user.id, targetId: data.id },
      });
    }

    const validatedData = UpdateUserProfileFormSchema.parse(data);

    // Verify that the email hasn't been changed (security check)
    const currentUserData = await prisma.user.findUnique({
      where: { id: validatedData.id },
      select: { email: true },
    });

    if (!currentUserData) {
      throw new DatabaseError("User not found", {
        context: { function: "updateUserProfile", userId: validatedData.id },
      });
    }

    // Ensure email matches the current user's email (prevent email changes)
    if (currentUserData.email !== validatedData.email) {
      throw new ValidationError("Email address cannot be changed", {
        context: { function: "updateUserProfile", userId: validatedData.id },
      });
    }

    // Only update the name, not the email
    const updatedUser = await prisma.user.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return { data: updatedUser, success: true };
  } catch (error) {
    const msg = "Failed to update user profile.";
    return handleError(error, msg);
  }
};

