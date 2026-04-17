/**
 * Base application error class with context support
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;
  public readonly originalError?: Error;

  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      context?: Record<string, unknown>;
      originalError?: Error;
    }
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = options?.code || "APP_ERROR";
    this.statusCode = options?.statusCode || 500;
    this.context = options?.context;
    this.originalError = options?.originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Database error class
 */
export class DatabaseError extends AppError {
  constructor(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      originalError?: Error;
    }
  ) {
    super(message, {
      code: "DATABASE_ERROR",
      statusCode: 500,
      ...options,
    });
    this.name = "DatabaseError";
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      context?: Record<string, unknown>;
      originalError?: Error;
    }
  ) {
    super(message, {
      code: "AUTHENTICATION_ERROR",
      statusCode: options?.statusCode ?? 401,
      context: options?.context,
      originalError: options?.originalError,
    });
    this.name = "AuthenticationError";
  }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      originalError?: Error;
    }
  ) {
    super(message, {
      code: "VALIDATION_ERROR",
      statusCode: 400,
      ...options,
    });
    this.name = "ValidationError";
  }
}

/**
 * External service error class (e.g., AI services)
 */
export class ExternalServiceError extends AppError {
  constructor(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      originalError?: Error;
    }
  ) {
    super(message, {
      code: "EXTERNAL_SERVICE_ERROR",
      statusCode: 502,
      ...options,
    });
    this.name = "ExternalServiceError";
  }
}

















