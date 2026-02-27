import { createController } from "@literallyjoel/router";
import { auth } from "apps/backend/src/lib/auth";
import { withCorsHeaders } from "apps/backend/src/lib/cors";

const AuthGetController = createController(
  async (c) => {
    const response = await auth.handler(c.request);
    return withCorsHeaders(c.request, response);
  },
  {
    requiresAuthentication: false,
  },
);

export default AuthGetController;
