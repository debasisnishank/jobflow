"use strict";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  createResumeProfile,
  deleteFile,
  editResume,
  uploadFile,
} from "@/actions/profile.actions";
import { DatabaseError, ValidationError } from "@/lib/errors";
import prisma from "@/lib/db";

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
    
    const userId = session.accessToken.sub;
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const file = formData.get("file") as File;
    const resumeId = (formData.get("id") as string) ?? null;
    let fileId: string | undefined =
      (formData.get("fileId") as string) ?? undefined;
    
    let fileContent: Buffer | undefined;
    if (file && file.name) {
      fileContent = await uploadFile(file);
    }

    if (resumeId && title) {
      if (fileId && file?.name && fileContent) {
        await deleteFile(fileId);
        fileId = undefined;
      }

      const res = await editResume(
        resumeId,
        title,
        fileId,
        file?.name,
        fileContent
      );
      return NextResponse.json(res, { status: 200 });
    }

    const response = await createResumeProfile(
      title,
      file?.name ?? null,
      fileContent
    );
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message ?? "Resume update or File upload failed",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        error: "Resume update or File upload failed",
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
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
    
    const userId = session.accessToken.sub;

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Verify file ownership through Resume -> Profile -> userId
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        Resumes: {
          some: {
            profile: {
              userId: userId,
            },
          },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 });
    }

    const fileType = file.fileName.split(".").pop()?.toLowerCase() || "";
    let contentType;

    if (fileType === "pdf") {
      contentType = "application/pdf";
    } else if (fileType === "doc" || fileType === "docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else {
      contentType = "application/octet-stream";
    }

    // Access fileContent from Prisma Bytes type and convert to Uint8Array for NextResponse
    const fileContent = (file as unknown as { fileContent: Buffer }).fileContent;
    const fileContentArray = new Uint8Array(fileContent);

    const response = new NextResponse(fileContentArray, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
      },
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message ?? "File download failed",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      { error: "File download failed" },
      { status: 500 }
    );
  }
};
