import { type } from "arktype";
import { mealTypeSchema } from "packages/validation/src/common";

export const mealPlanEntryDbRowSchema = type({
  id: "string.uuid",
  mealPLanId: "string.uuid",
  recipeId: "string.uuid",
  date: "string.date",
  mealType: mealTypeSchema,
  servings: "number>0",
  order: "number.integer",
  nutritionSnapshot: "string.json",
});

export type MealPlanEntryDbRow = typeof mealPlanEntryDbRowSchema.infer;
