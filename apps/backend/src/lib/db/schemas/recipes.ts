import { type } from "arktype";

export const recipeDBRowSchema = type({
  id: "string.uuid",
  userId: "string",
  title: "string",
  "description?": "string | null",
  "instructions?": "string | null",
  "servings?": "number>0 | null",
  "prepMins?": "number.integer | null",
  "cookMins?": "number.integer | null",
  isPublic: "boolean",
  "deletedAt?": "string | null",
  createdAt: "string",
  updatedAt: "string",
});

export type RecipeDbRow = typeof recipeDBRowSchema.infer;
