import { createController } from "@literallyjoel/router";
import { corsPreflight } from "apps/backend/src/lib/cors";
import { withErrorHandling } from "apps/backend/src/lib/errors";

const AuthOptionsController = createController(
  withErrorHandling(
    async (c: { request: Request }) => {
      return corsPreflight(c.request);
    },
    {
      logMessage: "Auth OPTIONS request failed",
      getRequest: (c: { request: Request }) => c.request,
    },
  ),
  {
    requiresAuthentication: false,
  },
);

export default AuthOptionsController;
