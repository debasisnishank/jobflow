import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "PDF export functionality coming soon", resumeId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error exporting resume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export resume" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { resumeId } = await req.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "PDF export functionality coming soon", resumeId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error exporting resume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export resume" },
      { status: 500 }
    );
  }
}

