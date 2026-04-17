import { NextResponse } from "next/server";
import {
  AppError,
  AuthenticationError,
  ValidationError,
  ExternalServiceError,
  DatabaseError,
} from "@/lib/errors";

interface ErrorResponse {
  error: string;
  code?: string;
  statusCode?: number;
}

/**
 * Standardized error handler for API routes
 * Provides consistent error responses across all endpoints
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  // Handle known error types
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ExternalServiceError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof DatabaseError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes("OPENAI_API_KEY") || error.message.includes("API key")) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.",
          code: "CONFIGURATION_ERROR",
          statusCode: 500,
        },
        { status: 500 }
      );
    }

    if (
      error.message.includes("fetch") ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return NextResponse.json(
        {
          error: "Failed to connect to external service. Please check your internet connection.",
          code: "CONNECTION_ERROR",
          statusCode: 502,
        },
        { status: 502 }
      );
    }

    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          error: "Invalid API credentials. Please check your API key.",
          code: "AUTHENTICATION_ERROR",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    if (error.message.includes("429") || error.message.includes("rate limit")) {
      return NextResponse.json(
        {
          error: "API rate limit exceeded. Please try again later.",
          code: "RATE_LIMIT_ERROR",
          statusCode: 429,
        },
        { status: 429 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        statusCode: 500,
      },
      { status: 500 }
    );
  }

  // Fallback for unknown error types
  return NextResponse.json(
    {
      error: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    },
    { status: 500 }
  );
}

/**
 * Validates authentication and returns error response if not authenticated
 */
export function requireAuth(session: unknown): NextResponse<ErrorResponse> | null {
  if (!session || (typeof session === "object" && !("user" in session))) {
    return NextResponse.json(
      {
        error: "Not Authenticated",
        code: "AUTHENTICATION_ERROR",
        statusCode: 401,
      },
      { status: 401 }
    );
  }
  return null;
}
