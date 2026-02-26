import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHORIZED";

interface ApiErrorOptions {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
  status?: number;
}

/**
 * Creates a standardized JSON error response for API routes.
 */
export function apiError(options: ApiErrorOptions): NextResponse {
  const { code, message, details, status = 400 } = options;
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status }
  );
}

/**
 * Wraps an async API handler with standard error catching.
 */
export function withErrorHandling(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (err) {
      console.error("[API Error]", err);
      return apiError({
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
        status: 500,
      });
    }
  };
}
