import env from "../../env";
import { AppError, serializeError, toAppError } from "./AppError";

export function createErrorResponse(error: unknown): Response {
  const appError = toAppError(error);

  return Response.json(
    {
      error: {
        code: appError.code,
        message: appError.expose
          ? appError.message
          : "An unexpected error occurred",
        data: appError.expose ? appError.data : undefined,
        ...(env.NODE_ENV !== "production"
          ? {
              debug: serializeError(appError),
            }
          : {}),
      },
    },
    {
      status: appError.statusCode,
    },
  );
}

export function buildErrorLogContext(error: unknown, request?: Request) {
  const appError = toAppError(error);

  return {
    error: serializeError(appError, {
      includeStack: env.NODE_ENV !== "production",
    }),
    request: request
      ? {
          method: request.method,
          url: request.url,
          referrer: request.referrer
        }
      : undefined,
  };
}

export function isOperationalError(error: unknown): error is AppError {
  return error instanceof AppError;
}
