import { describe, expect, it } from "bun:test";

process.env.DATABASE_URL ??= "https://db.example.com";
process.env.BETTER_AUTH_SECRET ??= "test-secret";
process.env.BETTER_AUTH_URL ??= "https://auth.example.com";
process.env.GOOGLE_CLIENT_ID ??= "google-client-id";
process.env.GOOGLE_CLIENT_SECRET ??= "google-client-secret";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.NODE_ENV ??= "test";

const env = (await import("../../env")).default as {
  NODE_ENV: "development" | "production" | "test";
};
const { AppError } = await import("./AppError");
const { buildErrorLogContext, isOperationalError } = await import("./http");

describe("http error helpers", () => {
  it("builds sanitized request context and keeps stacks outside production", () => {
    env.NODE_ENV = "test";

    const request = {
      method: "POST",
      url: "https://api.example.com/auth/callback?code=secret&state=abc",
      referrer: "https://frontend.example.com/login?next=/recipes",
    } as Request;

    const context = buildErrorLogContext(
      new AppError("bad request", { code: "BAD_REQUEST" }),
      request,
    );

    expect(context).toMatchObject({
      request: {
        method: "POST",
        url: "https://api.example.com/auth/callback",
        referrer: "https://frontend.example.com/login",
      },
      error: {
        name: "AppError",
        message: "bad request",
        code: "BAD_REQUEST",
      },
    });
    expect(context.error.stack).toBeString();
  });

  it("omits stacks in production and sanitizes relative or invalid URLs safely", () => {
    env.NODE_ENV = "production";

    const request = {
      method: "GET",
      url: "/api/recipes?draft=true",
      referrer: "not a valid url",
    } as unknown as Request;

    const context = buildErrorLogContext(new Error("boom"), request);

    expect(context).toEqual({
      error: {
        name: "Error",
        message: "boom",
        stack: undefined,
        cause: undefined,
      },
      request: {
        method: "GET",
        url: "/api/recipes",
        referrer: "/not%20a%20valid%20url",
      },
    });
  });

  it("detects operational errors by AppError instance", () => {
    expect(isOperationalError(new AppError("known failure"))).toBe(true);
    expect(isOperationalError(new Error("unknown failure"))).toBe(false);
  });
});
