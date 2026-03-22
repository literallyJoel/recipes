import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

process.env.DATABASE_URL ??= "https://db.example.com";
process.env.BETTER_AUTH_SECRET ??= "test-secret";
process.env.BETTER_AUTH_URL ??= "https://auth.example.com";
process.env.GOOGLE_CLIENT_ID ??= "google-client-id";
process.env.GOOGLE_CLIENT_SECRET ??= "google-client-secret";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.NODE_ENV ??= "test";

const env = (await import("../env")).default as { ENABLE_CACHE: boolean };
const { redis } = await import("bun");
const Cache = (await import("./cache")).default;
const { Log } = await import("./logging/Log");

describe("Cache", () => {
  beforeEach(() => {
    env.ENABLE_CACHE = true;
  });

  afterEach(() => {
    mock.restore();
    env.ENABLE_CACHE = true;
  });

  it("returns parsed cached values", async () => {
    redis.get = mock(async () => JSON.stringify({ title: "Pasta" }));
    const cache = new Cache();

    await expect(cache.get<{ title: string }>("recipe:1")).resolves.toEqual({
      title: "Pasta",
    });
  });

  it("deletes corrupt cache entries and warns instead of throwing", async () => {
    redis.get = mock(async () => "{bad json");
    redis.del = mock(async () => 1);
    const warn = mock(() => {});
    Log.warn = warn;
    const cache = new Cache();

    await expect(cache.get("recipe:2")).resolves.toBeNull();
    expect(redis.del).toHaveBeenCalledWith("recipe:2");
    expect(warn).toHaveBeenCalledWith(
      "Failed to parse cached value as JSON",
      expect.objectContaining({ key: "recipe:2" }),
    );
  });

  it("writes values and applies ttl when provided", async () => {
    redis.set = mock(async () => "OK" as const);
    redis.expire = mock(async () => 1);
    const cache = new Cache();

    await cache.set("recipe:3", { servings: 4 }, 120);

    expect(redis.set).toHaveBeenCalledWith(
      "recipe:3",
      JSON.stringify({ servings: 4 }),
    );
    expect(redis.expire).toHaveBeenCalledWith("recipe:3", 120);
  });

  it("short-circuits redis access completely when caching is disabled", async () => {
    env.ENABLE_CACHE = false;
    redis.get = mock(async () => JSON.stringify({ shouldNotRead: true }));
    redis.set = mock(async () => "OK" as const);
    const callback = mock(() => ({ computed: true }));
    const cache = new Cache();

    await expect(cache.get("recipe:4")).resolves.toBeNull();
    await expect(cache.compute("recipe:4", callback, 30)).resolves.toEqual({
      computed: true,
    });

    expect(redis.get).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
