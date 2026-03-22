import type { DatabaseClient } from "../client";

/**
 * Base class for read/write models that coordinate multiple DAOs or custom SQL
 * queries under an optional shared database client or transaction.
 */
export abstract class BaseModel {
  constructor(protected readonly client?: DatabaseClient) {}
}
