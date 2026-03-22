import { describe, expect, it } from "bun:test";

process.env.DATABASE_URL ??= "https://db.example.com";
process.env.BETTER_AUTH_SECRET ??= "test-secret";
process.env.BETTER_AUTH_URL ??= "https://auth.example.com";
process.env.GOOGLE_CLIENT_ID ??= "google-client-id";
process.env.GOOGLE_CLIENT_SECRET ??= "google-client-secret";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.NODE_ENV ??= "test";

const { AUTH_TRUSTED_ORIGINS, corsPreflight, withCorsHeaders } = await import(
  "./cors"
);

describe("cors", () => {
  it("includes the auth base URL in trusted origins", () => {
    expect(AUTH_TRUSTED_ORIGINS).toContain("https://auth.example.com");
  });

  it("adds CORS headers only for trusted origins", async () => {
    const trustedRequest = new Request("https://api.example.com/auth/session", {
      headers: {
        origin: "https://auth.example.com",
      },
    });
    const response = new Response("ok", {
      headers: {
        "Content-Type": "text/plain",
      },
    });

    const trustedResponse = withCorsHeaders(trustedRequest, response);

    expect(await trustedResponse.text()).toBe("ok");
    expect(trustedResponse.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://auth.example.com",
    );
    expect(
      trustedResponse.headers.get("Access-Control-Allow-Credentials"),
    ).toBe("true");
    expect(trustedResponse.headers.get("Vary")).toBe("Origin");
    expect(trustedResponse.headers.get("Content-Type")).toBe("text/plain");

    const untrustedRequest = new Request(
      "https://api.example.com/auth/session",
      {
        headers: {
          origin: "https://evil.example.com",
        },
      },
    );
    const untrustedResponse = withCorsHeaders(untrustedRequest, response);

    expect(untrustedResponse).toBe(response);
    expect(
      untrustedResponse.headers.get("Access-Control-Allow-Origin"),
    ).toBeNull();
  });

  it("returns a permissive preflight response only for trusted origins", () => {
    const trustedRequest = new Request("https://api.example.com/auth/session", {
      method: "OPTIONS",
      headers: {
        origin: "http://localhost:5173",
        "access-control-request-headers": "Content-Type, X-Trace-Id",
      },
    });

    const trustedResponse = corsPreflight(trustedRequest);

    expect(trustedResponse.status).toBe(204);
    expect(trustedResponse.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://localhost:5173",
    );
    expect(trustedResponse.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET,POST,OPTIONS",
    );
    expect(trustedResponse.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type, X-Trace-Id",
    );

    const untrustedRequest = new Request(
      "https://api.example.com/auth/session",
      {
        method: "OPTIONS",
        headers: {
          origin: "https://evil.example.com",
        },
      },
    );

    const untrustedResponse = corsPreflight(untrustedRequest);

    expect(untrustedResponse.status).toBe(204);
    expect(
      untrustedResponse.headers.get("Access-Control-Allow-Origin"),
    ).toBeNull();
  });
});
