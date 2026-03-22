import { redis as client } from "bun";
import env from "../env";
import { ExternalServiceError } from "./errors";
import { Log } from "./logging/Log";

class Cache {
  async get<T>(key: string): Promise<T | null> {
    if (!env.ENABLE_CACHE) return null;
    try {
      const raw = await client.get(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch (error) {
        Log.warn("Failed to parse cached value as JSON", {
          key,
          error,
        });
        await this.delete(key);
        return null;
      }
    } catch (error) {
      Log.warn("Cache read failed", {
        key,
        error: new ExternalServiceError("Failed to read from Redis", {
          data: { key },
          cause: error,
        }),
      });
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    if (!env.ENABLE_CACHE) return;
    try {
      await client.del(key);
    } catch (error) {
      Log.warn("Cache delete failed", {
        key,
        error: new ExternalServiceError("Failed to delete from Redis", {
          data: { key },
          cause: error,
        }),
      });
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!env.ENABLE_CACHE) return;
    try {
      await client.set(key, JSON.stringify(value));
      if (ttl !== undefined) await client.expire(key, ttl);
    } catch (error) {
      Log.warn("Cache write failed", {
        key,
        ttl,
        error: new ExternalServiceError("Failed to write to Redis", {
          data: { key, ttl },
          cause: error,
        }),
      });
    }
  }

  async compute<T>(key: string, callback: () => T, ttl?: number) {
    let value: T | null = null;

    if (env.ENABLE_CACHE) {
      value = await this.get(key);
      if (value !== null) return value;
    }

    value = await callback();

    await this.set(key, value, ttl);

    return value;
  }
}

export type CacheClient = InstanceType<typeof Cache>;

export default Cache;
