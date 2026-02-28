import { type } from "arktype";
import { serverGeneratedFields } from "./common";

export const createStoreSchema = type({
  name: "string",
  "logoUrl?": "string.url",
});

export const storeSchema = createStoreSchema.and(serverGeneratedFields);

export const updateStoreSchema = createStoreSchema.partial();

export type CreateStoreInput = typeof createStoreSchema.infer;
export type UpdateStoreInput = typeof updateStoreSchema.infer;
export type Store = typeof storeSchema.infer;
