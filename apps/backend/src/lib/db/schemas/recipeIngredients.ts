import { type } from "arktype";

export const recipeIngredientDbRowSchema = type({
  id: "string.uuid",
  recipeId: "string.uuid",
  ingredientId: "string.uuid",
  quantity: "number",
  quantityUnit: "string",
  "notes?": "string | null",
  order: "number.integer",
});

export type RecipeIngredientDbRow = typeof recipeIngredientDbRowSchema.infer;
