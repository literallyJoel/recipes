import { type } from "arktype";
import { MealType, ServerGeneratedFields, stubSchema } from "./common";
import { userSchema } from "./users";
import { StoreSchema } from "./stores";
import { nutritionalTargetSchema } from "./nutrition";
import { recipeSchema } from "./recipes";

export const createMealPlanSchema = type({
  label: "string",
  startDate: "Date",
  endDate: "Date",
  config: "string.json",
  user: stubSchema(userSchema),
  "store?": stubSchema(StoreSchema),
  "nutritionalTarget?": stubSchema(nutritionalTargetSchema),
});

export const updateMealPlanSchema = createMealPlanSchema.partial();

export const mealPlanSchema = createMealPlanSchema.and(ServerGeneratedFields);

export type CreateMealPlan = typeof createMealPlanSchema.infer;
export type UpdateMealPlan = typeof updateMealPlanSchema.infer;
export type MealPlan = typeof mealPlanSchema.infer;

export const createMealPlanEntrySchema = type({
  mealPlan: stubSchema(mealPlanSchema),
  recipe: stubSchema(recipeSchema),
  date: "Date",
  mealType: MealType,
  servings: "number.integer>0",
  order: "number.integer",
  nutritionSnapshot: "string.json",
});

export const updateMealPlanEntrySchema = createMealPlanEntrySchema.partial();

export const mealPlanEntrySchema = createMealPlanEntrySchema.and({
  id: "string.uuid",
});

export type CreateMealPlanEntry = typeof createMealPlanEntrySchema.infer;
export type UpdateMealPlanEntry = typeof updateMealPlanEntrySchema.infer;
export type MealPlanEntry = typeof mealPlanEntrySchema.infer;
