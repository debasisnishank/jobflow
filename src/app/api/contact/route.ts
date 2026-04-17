import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail, sendContactConfirmationEmail } from "@/lib/email";
import { appConfig } from "@/lib/config/app.config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Send email to support (receiver)
    await sendContactFormEmail({
      senderName: name,
      senderEmail: email,
      subject,
      message,
    });

    // Send confirmation email to sender
    await sendContactConfirmationEmail({
      recipientName: name,
      recipientEmail: email,
      subject,
    });

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    
    // Check if it's an SMTP authentication error
    let errorMessage = "Failed to send message. Please try again later.";
    if (error && typeof error === 'object' && 'code' in error && error.code === 'DATABASE_ERROR') {
      const dbError = error as { message?: string; context?: { hint?: string } };
      if (dbError.message?.includes('SMTP authentication failed')) {
        errorMessage = "Email service configuration error. Please contact the administrator.";
        console.error("SMTP Configuration Error - Admin should check SMTP settings:", dbError.context?.hint);
      } else if (dbError.message) {
        errorMessage = dbError.message;
      }
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

