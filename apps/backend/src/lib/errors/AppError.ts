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
  data?: unknown;
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
  return serializeErrorInternal(error, includeStack, new WeakSet<object>());
}

function serializeErrorInternal(
  error: unknown,
  includeStack: boolean,
  seen: WeakSet<object>,
): SerializedError {
  if (error && typeof error === "object") {
    if (seen.has(error)) {
      return {
        name: "CircularError",
        message: "[Circular]",
      };
    }

    seen.add(error);
  }

  if (isAppError(error)) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      data: sanitizeData(error.data, includeStack, seen),
      stack: includeStack ? error.stack : undefined,
      cause:
        error.cause === undefined
          ? undefined
          : serializeErrorInternal(error.cause, includeStack, seen),
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
          : serializeErrorInternal(error.cause, includeStack, seen),
    };
  }

  return {
    name: "NonErrorThrown",
    message: "A non-Error value was thrown",
    data: sanitizeData({
      value: error,
    }, includeStack, seen),
  };
}

function sanitizeData(
  value: unknown,
  includeStack: boolean,
  seen: WeakSet<object>,
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "symbol") {
    return String(value);
  }

  if (typeof value === "function") {
    return `[Function ${value.name || "anonymous"}]`;
  }

  if (typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (value instanceof Error) {
    return serializeErrorInternal(value, includeStack, seen);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeData(entry, includeStack, seen));
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entryValue]) => {
      const sanitizedValue = sanitizeData(entryValue, includeStack, seen);
      return sanitizedValue === undefined ? [] : [[key, sanitizedValue]];
    }),
  );
}
