import { type } from "arktype";

export const storeDBRowSchema = type({
  id: "string.uuid",
  name: "string",
  "logoUrl?": "string | null",
  createdAt: "string",
  updatedAt: "string",
});

export type StoreDBRow = typeof storeDBRowSchema.infer;
