import { createController } from "@literallyjoel/router";
import { auth } from "apps/backend/src/lib/auth";
import { withCorsHeaders } from "apps/backend/src/lib/cors";
import { withErrorHandling } from "apps/backend/src/lib/errors";

const AuthPostController = createController(
  withErrorHandling(
    async (c: { request: Request }) => {
      const response = await auth.handler(c.request);
      return withCorsHeaders(c.request, response);
    },
    {
      logMessage: "Auth POST request failed",
      getRequest: (c: { request: Request }) => c.request,
    },
  ),
  {
    requiresAuthentication: false,
  },
);

export default AuthPostController;
