import { type } from "arktype";

export const recipeDBRowSchema = type({
  id: "string",
  userId: "string",
  title: "string",
  "description?": "string",
  "instructions?": "string",
  "servings?": "number>0",
  "prepMins?": "number.integer",
  "cookMins?": "number.integer",
  isPublic: "boolean",
  "deletedAt?": "string | null",
  createdAt: "string",
  updatedAt: "string",
});

export type RecipeDbRow = typeof recipeDBRowSchema.infer;
