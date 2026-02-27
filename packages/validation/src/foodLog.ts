import { type } from "arktype";
import { ServerGeneratedFields } from "./common";
import { MealTypeSchema, RecipeSchema } from "./recipes";
import { IngredientSchema } from "./ingredients";
import { NutritionSnapshotSchema } from "./nutrition";

const FoodLogEntrySourceSchema = type({
  recipeId: "string.uuid",
  "ingredientId?": "never",
})
  .or({ ingredientId: "string.uuid", "recipeId?": "never" })
  .or({
    "recipeId?": "never",
    "ingredientId?": "never",
  });

const FoodLogEntryBaseInputSchema = type({
  "mealPlanEntryId?": "string.uuid",
  date: "Date",
  "mealType?": MealTypeSchema,
  loggedAt: "Date",
  "servings?": "number > 0",
  "quantity?": "number > 0",
  "quantityUnit?": "string",
  "label?": "string",
  "nutritionSnapshot?": NutritionSnapshotSchema,
});

export const CreateFoodLogEntryInputSchema = FoodLogEntryBaseInputSchema.and(
  FoodLogEntrySourceSchema,
);

const FoodLogEntrySourceExpandedSchema = type({
  recipe: RecipeSchema,
  "ingredient?": "never",
})
  .or({ ingredient: IngredientSchema, "recipe?": "never" })
  .or({
    "recipe?": "never",
    "ingredient?": "never",
  });

export const FoodLogEntrySchema = FoodLogEntryBaseInputSchema.and(
  FoodLogEntrySourceExpandedSchema,
)
  .and(ServerGeneratedFields)
  .and(type({ userId: "string.uuid" }));

export const UpdateFoodLogEntryInputSchema =
  CreateFoodLogEntryInputSchema.partial();

export type CreateFoodLogEntryInput =
  typeof CreateFoodLogEntryInputSchema.infer;
export type UpdateFoodLogEntryInput =
  typeof UpdateFoodLogEntryInputSchema.infer;
export type FoodLogEntry = typeof FoodLogEntrySchema.infer;
