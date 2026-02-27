import arkenv from "arkenv";

const env = arkenv({
  DATABASE_URL: "string.url",
  BETTER_AUTH_SECRET: "string",
  BETTER_AUTH_URL: "string.url",
  GOOGLE_CLIENT_ID: "string",
  GOOGLE_CLIENT_SECRET: "string",
  REDIS_URL: "string",
  NODE_ENV: "'development' | 'produciton' | 'test' = 'development'",
  BETTER_AUTH_LOG_LEVEL: "'debug' | 'info' | 'warn' | 'error' = 'info'"
});

export default env;
