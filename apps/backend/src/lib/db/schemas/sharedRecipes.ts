import { type } from "arktype";

export const sharedRecipeDbRowSchema = type({
  id: "string.uuid",
  recipeId: "string.uuid",
  sharedById: "string",
  sharedWithId: "string",
  canEdit: "boolean",
  createdAt: "string",
});

export type SharedRecipeDbRow = typeof sharedRecipeDbRowSchema.infer;
