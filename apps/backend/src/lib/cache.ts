import { redis as client } from "bun";
import env from "../env";

class Cache {
  async get<T>(key: string): Promise<T | null> {
    if (!env.ENABLE_CACHE) return null;
    try {
      const raw = await client.get(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as T;
      }
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!env.ENABLE_CACHE) return;
    try {
      await client.set(key, JSON.stringify(value));
      if (ttl !== undefined) await client.expire(key, ttl);
    } catch {
      // Fail open: cache should not break the primary code path.
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
