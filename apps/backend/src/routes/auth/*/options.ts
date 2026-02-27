import { createController } from "@literallyjoel/router";
import { corsPreflight } from "apps/backend/src/lib/cors";

const AuthOptionsController = createController(
  async (c) => {
    return corsPreflight(c.request);
  },
  {
    requiresAuthentication: false,
  },
);

export default AuthOptionsController;
