import type { DatabaseClient } from "../client";

export abstract class BaseModel {
  constructor(protected readonly client?: DatabaseClient) {}
}
