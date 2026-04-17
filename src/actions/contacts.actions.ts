"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/utils/user.utils";
import { revalidatePath } from "next/cache";
import { AuthenticationError, ValidationError } from "@/lib/errors";
import { Contact, ContactInteraction, ContactFormData, ContactInteractionFormData } from "@/models/contact.model";

export async function getContactsList(
  page = 1,
  limit = 15,
  search?: string
): Promise<{ data: Contact[]; total: number; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const skip = (page - 1) * limit;
    const where: any = {
      createdBy: user.id,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          Interactions: {
            orderBy: { date: "desc" },
            take: 1,
          },
          linkedJobs: {
            include: {
              job: {
                include: {
                  JobTitle: true,
                  Company: true,
                },
              },
            },
          },
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return {
      data: data as Contact[],
      total,
      success: true,
    };
  } catch (error: any) {
    return {
      data: [],
      total: 0,
      success: false,
      message: error.message || "Failed to fetch contacts",
    };
  }
}

export async function getContactById(
  contactId: string
): Promise<{ data: Contact | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        createdBy: user.id,
      },
      include: {
        Interactions: {
          orderBy: { date: "desc" },
        },
        linkedJobs: {
          include: {
            job: {
              include: {
                JobTitle: true,
                Company: true,
              },
            },
          },
        },
      },
    });

    return {
      data: contact as Contact | null,
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      success: false,
      message: error.message || "Failed to fetch contact",
    };
  }
}

export async function createContact(
  formData: ContactFormData
): Promise<{ data: Contact | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    if (!formData.firstName || formData.firstName.trim() === "") {
      throw new ValidationError("First name is required");
    }

    const contact = await prisma.contact.create({
      data: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName?.trim() || null,
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        title: formData.title?.trim() || null,
        company: formData.company?.trim() || null,
        linkedInUrl: formData.linkedInUrl?.trim() || null,
        notes: formData.notes?.trim() || null,
        tags: formData.tags || [],
        createdBy: user.id,
      },
      include: {
        Interactions: true,
        linkedJobs: true,
      },
    });

    revalidatePath("/dashboard/contacts");
    return {
      data: contact as Contact,
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      success: false,
      message: error.message || "Failed to create contact",
    };
  }
}

export async function updateContact(
  contactId: string,
  formData: ContactFormData
): Promise<{ data: Contact | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const existingContact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        createdBy: user.id,
      },
    });

    if (!existingContact) {
      throw new ValidationError("Contact not found");
    }

    if (!formData.firstName || formData.firstName.trim() === "") {
      throw new ValidationError("First name is required");
    }

    const contact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName?.trim() || null,
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        title: formData.title?.trim() || null,
        company: formData.company?.trim() || null,
        linkedInUrl: formData.linkedInUrl?.trim() || null,
        notes: formData.notes?.trim() || null,
        tags: formData.tags || [],
      },
      include: {
        Interactions: true,
        linkedJobs: true,
      },
    });

    revalidatePath("/dashboard/contacts");
    return {
      data: contact as Contact,
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      success: false,
      message: error.message || "Failed to update contact",
    };
  }
}

export async function deleteContact(
  contactId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const existingContact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        createdBy: user.id,
      },
    });

    if (!existingContact) {
      throw new ValidationError("Contact not found");
    }

    await prisma.contact.delete({
      where: { id: contactId },
    });

    revalidatePath("/dashboard/contacts");
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete contact",
    };
  }
}

export async function addContactInteraction(
  contactId: string,
  formData: ContactInteractionFormData
): Promise<{ data: ContactInteraction | null; success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const existingContact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        createdBy: user.id,
      },
    });

    if (!existingContact) {
      throw new ValidationError("Contact not found");
    }

    if (!formData.type || !formData.title) {
      throw new ValidationError("Type and title are required");
    }

    const interaction = await prisma.contactInteraction.create({
      data: {
        contactId,
        type: formData.type.trim(),
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        date: formData.date,
      },
    });

    revalidatePath(`/dashboard/contacts/${contactId}`);
    revalidatePath("/dashboard/contacts");
    return {
      data: interaction as ContactInteraction,
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      success: false,
      message: error.message || "Failed to add interaction",
    };
  }
}

export async function deleteContactInteraction(
  interactionId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError("Not authenticated");
    }

    const interaction = await prisma.contactInteraction.findFirst({
      where: { id: interactionId },
      include: { contact: true },
    });

    if (!interaction || interaction.contact.createdBy !== user.id) {
      throw new ValidationError("Interaction not found");
    }

    await prisma.contactInteraction.delete({
      where: { id: interactionId },
    });

    revalidatePath("/dashboard/contacts");
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete interaction",
    };
  }
}



