import { type } from "arktype";
import { mealTypeSchema } from "packages/validation/src/common";

export const foodLogEntryDbRowSchema = type({
  id: "string.uuid",
  userId: "string",
  date: "string.date",
  mealType: mealTypeSchema,
  loggedAt: "string",
  "recipeId?": "string.uuid",
  "ingredientId?": "string.uuid",
  "servings?": "number",
  "quantity?": "number",
  "quantityUnit?": "string",
  "label?": "string",
  "nutritionSnapshot?": "string.json",
  createdAt: "string",
  updatedAt: "string",
});

export type FoodLogEntryDbRow = typeof foodLogEntryDbRowSchema.infer;
