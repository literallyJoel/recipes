import { serve, sql } from "bun";
import index from "../../web/index.html";
import { getRoutes } from "@literallyjoel/router";
import { join } from "path";
import { Log } from "./lib/logging/Log";

const routes = await getRoutes({
  routesDirectory: join(import.meta.dir, "routes"),
  routePrefix: "/api",
});

const server = serve({
  hostname: "0.0.0.0",
  port: 8181,
  routes: {
    "/*": index,
    ...routes,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

Log.info(`Server started`, { host: server.hostname, port: server.port });
