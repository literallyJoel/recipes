import { afterEach, describe, expect, it, mock } from "bun:test";

process.env.DATABASE_URL ??= "https://db.example.com";
process.env.BETTER_AUTH_SECRET ??= "test-secret";
process.env.BETTER_AUTH_URL ??= "https://auth.example.com";
process.env.GOOGLE_CLIENT_ID ??= "google-client-id";
process.env.GOOGLE_CLIENT_SECRET ??= "google-client-secret";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.NODE_ENV ??= "test";

const { Log } = await import("../logging/Log");
const { AppError } = await import("./AppError");
const { withErrorHandling } = await import("./withErrorHandling");

afterEach(() => {
  mock.restore();
});

describe("withErrorHandling", () => {
  it("returns the original result when the handler succeeds", async () => {
    const wrapped = withErrorHandling(async (value: number) => value * 2, {
      logMessage: "should not log",
    });

    await expect(wrapped(4)).resolves.toBe(8);
  });

  it("logs enriched error context and rethrows failures", async () => {
    const logError = mock(() => {});
    Log.error = logError;

    const request = new Request("https://api.example.com/recipes?draft=true", {
      method: "POST",
    });
    const error = new AppError("save failed", { code: "SAVE_FAILED" });

    const wrapped = withErrorHandling(
      async (context: { request: Request }) => {
        throw error;
      },
      {
        logMessage: "Recipe request failed",
        getRequest: (context) => context.request,
      },
    );

    await expect(wrapped({ request })).rejects.toBe(error);
    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(
      "Recipe request failed",
      expect.objectContaining({
        error: expect.objectContaining({
          message: "save failed",
          code: "SAVE_FAILED",
        }),
        request: {
          method: "POST",
          url: "https://api.example.com/recipes",
          referrer: undefined,
        },
      }),
    );
  });
});
