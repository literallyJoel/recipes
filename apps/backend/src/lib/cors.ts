import env from "../env";

const DEV_FRONTEND_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://localhost:5173",
  "https://127.0.0.1:5173",
] as const;

export const AUTH_TRUSTED_ORIGINS = Array.from(
  new Set([env.BETTER_AUTH_URL, ...DEV_FRONTEND_ORIGINS]),
);

const resolveAllowedOrigin = (request: Request): string | null => {
  const requestOrigin = request.headers.get("origin");
  if (!requestOrigin) return null;
  return AUTH_TRUSTED_ORIGINS.includes(requestOrigin) ? requestOrigin : null;
};

export const withCorsHeaders = (request: Request, response: Response) => {
  const allowedOrigin = resolveAllowedOrigin(request);
  if (!allowedOrigin) return response;

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Vary", "Origin");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const corsPreflight = (request: Request) => {
  const allowedOrigin = resolveAllowedOrigin(request);
  if (!allowedOrigin) return new Response(null, { status: 204 });

  const requestHeaders =
    request.headers.get("access-control-request-headers") ??
    "Content-Type, Authorization";

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": requestHeaders,
      "Access-Control-Max-Age": "600",
      Vary: "Origin",
    },
  });
};
