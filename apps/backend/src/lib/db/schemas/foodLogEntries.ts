import { type } from "arktype";
import { mealTypeSchema } from "packages/validation/src/common";

export const foodLogEntryDbRowSchema = type({
  id: "string.uuid",
  userId: "string",
  date: "string.date",
  mealType: mealTypeSchema,
  loggedAt: "string",
  "recipeId?": "string.uuid | null",
  "ingredientId?": "string.uuid | null",
  "servings?": "number | null",
  "quantity?": "number | null",
  "quantityUnit?": "string | null",
  "label?": "string | null",
  "nutritionSnapshot?": "string.json | null",
  createdAt: "string",
  updatedAt: "string",
});

export type FoodLogEntryDbRow = typeof foodLogEntryDbRowSchema.infer;
