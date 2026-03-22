import { describe, expect, it } from "bun:test";
import {
  AppError,
  DatabaseError,
  isAppError,
  serializeError,
} from "./AppError";

describe("AppError", () => {
  it("applies subclass defaults and isAppError identifies app errors", () => {
    const error = new DatabaseError();

    expect(error.name).toBe("DatabaseError");
    expect(error.message).toBe("A database error occurred");
    expect(error.code).toBe("DATABASE_ERROR");
    expect(isAppError(error)).toBe(true);
    expect(isAppError(new Error("boom"))).toBe(false);
  });

  it("serializes app errors with sanitized data and nested causes", () => {
    const rootCause = new Error("redis timed out");
    const circular: Record<string, unknown> = { label: "loop" };
    circular.self = circular;

    const error = new AppError("request failed", {
      code: "REQUEST_FAILED",
      cause: new AppError("cache unavailable", {
        code: "CACHE_DOWN",
        cause: rootCause,
      }),
      data: {
        count: 2n,
        when: new Date("2026-01-02T03:04:05.000Z"),
        symbol: Symbol.for("recipe"),
        formatter: function formatRecipe() {},
        circular,
        skipMe: undefined,
      },
    });

    expect(serializeError(error, { includeStack: false })).toEqual({
      name: "AppError",
      message: "request failed",
      code: "REQUEST_FAILED",
      data: {
        count: "2",
        when: "2026-01-02T03:04:05.000Z",
        symbol: "Symbol(recipe)",
        formatter: "[Function formatRecipe]",
        circular: {
          label: "loop",
          self: "[Circular]",
        },
      },
      stack: undefined,
      cause: {
        name: "AppError",
        message: "cache unavailable",
        code: "CACHE_DOWN",
        data: undefined,
        stack: undefined,
        cause: {
          name: "Error",
          message: "redis timed out",
          stack: undefined,
          cause: undefined,
        },
      },
    });
  });

  it("serializes non-Error thrown values into a stable shape", () => {
    expect(serializeError({ status: 500, retry: false })).toEqual({
      name: "NonErrorThrown",
      message: "A non-Error value was thrown",
      data: {
        value: "[Circular]",
      },
    });
  });
});
