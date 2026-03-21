import { redis as client } from "bun";
import env from "../env";

class Cache {
  async get<T>(key: string): Promise<T | null> {
    if (!env.ENABLE_CACHE) return null;
    return (await client.get(key)) as T | null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!env.ENABLE_CACHE) return;
    await client.set(key, value as Bun.RedisClient.KeyLike);
    if (ttl) await client.expire(key, ttl);
  }

  async compute<T>(key: string, callback: () => T, ttl?: number) {
    let value: T | null = null;

    if (!env.ENABLE_CACHE) {
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
