import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const DAILY_API_KEY = process.env.DAILY_API_KEY;
    const DAILY_DOMAIN = process.env.DAILY_DOMAIN;
    const ENABLE_RECORDING = process.env.DAILY_ENABLE_RECORDING === "true";

    if (!DAILY_API_KEY) {
      return NextResponse.json(
        { error: "Daily.co API key not configured" },
        { status: 500 }
      );
    }

    // Build room properties
    const roomProperties: any = {
      max_participants: 1, // Only the user (AI interviewer doesn't need a participant slot)
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours from now
      eject_at_room_exp: true,
      enable_chat: false,
      enable_emoji_reactions: false,
      enable_screenshare: false,
    };

    // Only enable recording if configured in .env
    if (ENABLE_RECORDING) {
      roomProperties.enable_recording = "cloud";
      roomProperties.enable_transcription = true;
    }

    // Helper function to generate meeting token
    const generateToken = async (roomName: string) => {
      const tokenProperties: any = {
        room_name: roomName,
        is_owner: true,
      };

      if (ENABLE_RECORDING) {
        tokenProperties.enable_recording = "cloud";
      }

      const tokenResponse = await fetch("https://api.daily.co/v1/meeting-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          properties: tokenProperties,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error("Daily.co token error:", errorData);
        throw new Error("Failed to generate meeting token");
      }

      return await tokenResponse.json();
    };

    // Make room name unique by adding timestamp and random suffix
    const createUniqueRoomName = () => {
      return `interview-${sessionId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    };

    let roomName = createUniqueRoomName();
    let roomData = null;
    let attempts = 0;
    const maxAttempts = 3;

    // Try to create room, retry with new name if it already exists
    while (attempts < maxAttempts) {
      const response = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: roomName,
          properties: roomProperties,
        }),
      });

      if (response.ok) {
        roomData = await response.json();
        break;
      }

      const errorData = await response.json();
      
      // If room already exists, try with a new unique name
      if (errorData.error === "invalid-request-error" && errorData.info?.includes("already exists")) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.error("Failed to create room after multiple attempts");
          return NextResponse.json(
            { error: "Failed to create room: too many conflicts" },
            { status: 500 }
          );
        }
        roomName = createUniqueRoomName();
        continue;
      }

      // Other errors
      console.error("Daily.co API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create room" },
        { status: 500 }
      );
    }

    if (!roomData) {
      return NextResponse.json(
        { error: "Failed to create room" },
        { status: 500 }
      );
    }

    // Generate a meeting token for the user
    const tokenData = await generateToken(roomData.name);

    return NextResponse.json({
      roomUrl: roomData.url,
      roomName: roomData.name,
      token: tokenData.token,
    });
  } catch (error) {
    console.error("Error creating Daily.co room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

