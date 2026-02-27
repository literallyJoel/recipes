import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { redis } from "bun";
import { Log } from "./logging/Log";
import env from "../env";
import { AUTH_TRUSTED_ORIGINS } from "./cors";

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseUrl: env.BETTER_AUTH_URL,
  trustedOrigins: AUTH_TRUSTED_ORIGINS,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(key);
    },
    set: async (key, value, ttl) => {
      await redis.set(key, value);
      if (ttl) redis.expire(key, ttl);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  logger: {
    level: env.BETTER_AUTH_LOG_LEVEL,
    log: (level, message, ...args) => {
      const meta =
        args.length === 0
          ? undefined
          : args.length === 1
            ? { details: args[0] }
            : { details: args };
      Log[level](message, meta);
    },
  },
});
