export type ErrorContext = Record<string, unknown>;

export interface AppErrorOptions {
  code?: string;
  data?: ErrorContext;
  cause?: unknown;
}

interface SerializedError {
  name: string;
  message: string;
  code?: string;
  data?: ErrorContext;
  stack?: string;
  cause?: SerializedError;
}

export class AppError extends Error {
  readonly code: string;
  readonly data?: ErrorContext;
  override readonly cause?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, options.cause !== undefined ? { cause: options.cause } : {});
    this.name = new.target.name;
    this.code = options.code ?? "APP_ERROR";
    this.data = options.data;
    this.cause = options.cause;
  }
}

export class DatabaseError extends AppError {
  constructor(message = "A database error occurred", options: AppErrorOptions = {}) {
    super(message, {
      ...options,
      code: options.code ?? "DATABASE_ERROR",
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message = "An external service request failed",
    options: AppErrorOptions = {},
  ) {
    super(message, {
      ...options,
      code: options.code ?? "EXTERNAL_SERVICE_ERROR",
    });
  }
}

export class InternalError extends AppError {
  constructor(message = "An unexpected internal error occurred", options: AppErrorOptions = {}) {
    super(message, {
      ...options,
      code: options.code ?? "INTERNAL_ERROR",
    });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
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
      data: error.data,
      stack: includeStack ? error.stack : undefined,
      cause:
        error.cause === undefined
          ? undefined
          : serializeError(error.cause, options),
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
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
