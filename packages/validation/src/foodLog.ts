import { type } from "arktype";
import { MealType, ServerGeneratedFields, stubSchema } from "./common";
import { userSchema } from "./users";
import { recipeSchema } from "./recipes";
import { IngredientSchema } from "./ingredients";

export const createFoodLogEntrySchema = type({
  user: stubSchema(userSchema),
  date: "Date",
  mealType: MealType,
  loggedAt: "Date",
  "recipe?": stubSchema(recipeSchema),
  "ingredient?": stubSchema(IngredientSchema),
  "servings?": "number.integer",
  "quantity?": "number",
  "quantityUnit?": "string",
  "label?": "string",
  "nutritionSnapshot?": "string.json",
});

export const updateFoodLogEntrySchema = createFoodLogEntrySchema.partial();
export const foodLogEntrySchema = createFoodLogEntrySchema.and(
  ServerGeneratedFields,
);

export type CreateFoodLogEntry = typeof createFoodLogEntrySchema.infer;
export type UpdateFoodLogEntry = typeof updateFoodLogEntrySchema.infer;
export type FoodLogEntry = typeof foodLogEntrySchema.infer;
