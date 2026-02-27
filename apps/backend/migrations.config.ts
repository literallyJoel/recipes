import path from "node:path";
import { sql } from "bun";

export default {
  sql,
  migrationsDir: path.resolve("./migrations"),
  rollbackDir: path.resolve("./rollbacks")
};
