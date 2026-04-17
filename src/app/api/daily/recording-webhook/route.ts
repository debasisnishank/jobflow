import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Verify the webhook is from Daily.co (you should implement proper verification)
    // For now, we'll just process the recording completion event

    if (payload.type === "recording.ready-to-download") {
      const roomName = payload.room_name;
      const recordingUrl = payload.download_link;
      const duration = payload.duration; // in seconds

      // Extract session ID from room name (format: interview-{sessionId})
      const sessionId = roomName.replace("interview-", "");

      // Update the mock interview session with the recording URL
      await prisma.mockInterviewSession.update({
        where: { id: sessionId },
        data: {
          videoRecordingUrl: recordingUrl,
          videoDuration: duration,
        },
      });

      console.log(`Recording saved for session ${sessionId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Daily.co webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

