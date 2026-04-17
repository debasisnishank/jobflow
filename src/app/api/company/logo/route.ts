"use strict";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { uploadFile, deleteFile } from "@/actions/profile.actions";
import { createCompanyLogoFile } from "@/actions/company.actions";
import prisma from "@/lib/db";
import { DatabaseError, ValidationError } from "@/lib/errors";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const session = await auth();

  try {
    if (!session || !session.user || !session.accessToken) {
      return NextResponse.json(
        {
          error: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const companyId = formData.get("companyId") as string | null;
    const existingFileId = formData.get("fileId") as string | null;

    if (!file || !file.name) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    let fileContent: Buffer | undefined;
    if (file && file.name) {
      fileContent = await uploadFile(file);
    }

    // Delete existing file if updating
    if (existingFileId && fileContent) {
      try {
        await deleteFile(existingFileId);
      } catch (error) {
        // Ignore errors if file doesn't exist
      }
    }

    const fileId = await createCompanyLogoFile(file.name, fileContent);

    return NextResponse.json(
      { success: true, data: { fileId } },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message ?? "Logo upload failed",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        error: "Logo upload failed",
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Validate fileId format (MongoDB ObjectId format)
    if (!/^[0-9a-fA-F]{24}$/.test(fileId)) {
      return NextResponse.json(
        { error: "Invalid file ID format" },
        { status: 400 }
      );
    }

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Verify this is an image file (security check)
    const imageTypes = ["jpeg", "jpg", "png", "gif", "webp", "svg", "svg+xml"];
    const fileType = file.fileType.toLowerCase();
    
    if (!imageTypes.includes(fileType)) {
      return NextResponse.json(
        { error: "File is not an image" },
        { status: 400 }
      );
    }

    let contentType;

    if (fileType === "jpeg" || fileType === "jpg") {
      contentType = "image/jpeg";
    } else if (fileType === "png") {
      contentType = "image/png";
    } else if (fileType === "gif") {
      contentType = "image/gif";
    } else if (fileType === "webp") {
      contentType = "image/webp";
    } else if (fileType === "svg" || fileType === "svg+xml") {
      contentType = "image/svg+xml";
    } else {
      contentType = "image/jpeg"; // Default fallback
    }

    // Access fileContent from Prisma Bytes type and convert to Uint8Array for NextResponse
    const fileContent = (file as unknown as { fileContent: Buffer }).fileContent;
    const fileContentArray = new Uint8Array(fileContent);

    const response = new NextResponse(fileContentArray, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message ?? "File retrieval failed",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      { error: "File retrieval failed" },
      { status: 500 }
    );
  }
};

