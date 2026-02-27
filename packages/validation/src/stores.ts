import { type } from "arktype";
import { ServerGeneratedFields } from "./common";

export const CreateStoreInputSchema = type({
  name: "string",
  "logoUrl?": "string.url",
});

export const StoreSchema = CreateStoreInputSchema.and(ServerGeneratedFields);

export const UpdateStoreInputSchema = CreateStoreInputSchema.partial();

export type CreateStoreInput = typeof CreateStoreInputSchema.infer;
export type UpdateStoreInput = typeof UpdateStoreInputSchema.infer;
export type Store = typeof StoreSchema.infer;
