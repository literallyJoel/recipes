import { createController } from "@literallyjoel/router";
import { auth } from "apps/backend/src/lib/auth";
import { withCorsHeaders } from "apps/backend/src/lib/cors";

const AuthPostController = createController(
  async (c) => {
    const response = await auth.handler(c.request);
    return withCorsHeaders(c.request, response);
  },
  {
    requiresAuthentication: false,
  },
);

export default AuthPostController;
