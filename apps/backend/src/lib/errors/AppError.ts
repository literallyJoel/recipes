export type ErrorContext = Record<string, unknown>;

export interface AppErrorOptions {
  code?: string;
  statusCode?: number;
  expose?: boolean;
  data?: ErrorContext;
  cause?: unknown;
}

interface SerializedError {
  name: string;
  message: string;
  code?: string;
  statusCode?: number;
  expose?: boolean;
  data?: ErrorContext;
  stack?: string;
  cause?: SerializedError;
}

export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly expose: boolean;
  readonly data?: ErrorContext;
  override readonly cause?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, options.cause !== undefined ? { cause: options.cause } : {});
    this.name = new.target.name;
    this.code = options.code ?? "APP_ERROR";
    this.statusCode = options.statusCode ?? 500;
    this.expose = options.expose ?? false;
    this.data = options.data;
    this.cause = options.cause;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, options: Omit<AppErrorOptions, "statusCode"> = {}) {
    super(message, {
      ...options,
      code: options.code ?? "VALIDATION_ERROR",
      statusCode: 400,
      expose: options.expose ?? true,
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(
    message = "Authentication required",
    options: Omit<AppErrorOptions, "statusCode"> = {},
  ) {
    super(message, {
      ...options,
      code: options.code ?? "AUTHENTICATION_ERROR",
      statusCode: 401,
      expose: options.expose ?? true,
    });
  }
}

export class AuthorizationError extends AppError {
  constructor(
    message = "You do not have permission to perform this action",
    options: Omit<AppErrorOptions, "statusCode"> = {},
  ) {
    super(message, {
      ...options,
      code: options.code ?? "AUTHORIZATION_ERROR",
      statusCode: 403,
      expose: options.expose ?? true,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", options: Omit<AppErrorOptions, "statusCode"> = {}) {
    super(message, {
      ...options,
      code: options.code ?? "NOT_FOUND",
      statusCode: 404,
      expose: options.expose ?? true,
    });
  }
}

export class DatabaseError extends AppError {
  constructor(message = "A database error occurred", options: Omit<AppErrorOptions, "statusCode"> = {}) {
    super(message, {
      ...options,
      code: options.code ?? "DATABASE_ERROR",
      statusCode: 500,
      expose: options.expose ?? false,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message = "An external service request failed",
    options: Omit<AppErrorOptions, "statusCode"> = {},
  ) {
    super(message, {
      ...options,
      code: options.code ?? "EXTERNAL_SERVICE_ERROR",
      statusCode: 502,
      expose: options.expose ?? false,
    });
  }
}

export class InternalServerError extends AppError {
  constructor(message = "An unexpected error occurred", options: Omit<AppErrorOptions, "statusCode"> = {}) {
    super(message, {
      ...options,
      code: options.code ?? "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      expose: options.expose ?? false,
    });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(
  error: unknown,
  fallback: Omit<AppErrorOptions, "statusCode"> & { message?: string } = {},
): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(fallback.message ?? error.message, {
      ...fallback,
      cause: error,
    });
  }

  return new InternalServerError(fallback.message ?? "An unexpected error occurred", {
    ...fallback,
    data: {
      ...fallback.data,
      originalError: error,
    },
  });
}

export function serializeError(
  error: unknown,
  options: { includeStack?: boolean } = {},
): SerializedError {
  const includeStack = options.includeStack ?? true;

  if (isAppError(error)) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      expose: error.expose,
      data: error.data,
      stack: includeStack ? error.stack : undefined,
      cause:
        error.cause === undefined
          ? undefined
          : serializeError(error.cause, options),
    };
  }

  if (error instanceof Error) {
    const maybeCode = "code" in error ? error.code : undefined;

    return {
      name: error.name,
      message: error.message,
      code: typeof maybeCode === "string" ? maybeCode : undefined,
      stack: includeStack ? error.stack : undefined,
      cause:
        error.cause === undefined
          ? undefined
          : serializeError(error.cause, options),
    };
  }

  return {
    name: "NonErrorThrown",
    message: "A non-Error value was thrown",
    data: {
      value: error,
    },
  };
}
