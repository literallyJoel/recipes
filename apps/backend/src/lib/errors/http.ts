import env from "../../env";
import { AppError, serializeError } from "./AppError";

export function buildErrorLogContext(error: unknown, request?: Request) {
  return {
    error: serializeError(error, {
      includeStack: env.NODE_ENV !== "production",
    }),
    request: request
      ? {
          method: request.method,
          url: sanitizeUrl(request.url),
          referrer: sanitizeUrl(request.referrer),
        }
      : undefined,
  };
}

export function isOperationalError(
  error: unknown,
): error is AppError {
  return error instanceof AppError;
}

function sanitizeUrl(value: string): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    try {
      const url = new URL(value, "http://localhost");
      return url.pathname;
    } catch {
      return undefined;
    }
  }
}
