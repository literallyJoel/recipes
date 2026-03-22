import { type } from "arktype";
import { mealTypeSchema, serverGeneratedFields, stubSchema } from "./common";
import { userSchema } from "./users";
import { recipeSchema } from "./recipes";
import { ingredientSchema } from "./ingredients";

const foodLogSourceSchema = type({
  recipe: stubSchema(recipeSchema),
  "ingredient?": "never",
})
  .or({
    ingredient: stubSchema(ingredientSchema),
    "recipe?": "never",
  })
  .or({
    "recipe?": "never",
    "ingredient?": "never",
  });

const foodLogEntryBaseSchema = type({
  user: stubSchema(userSchema),
  date: "Date",
  mealType: mealTypeSchema,
  loggedAt: "Date",
  "servings?": "number > 0",
  "quantity?": "number > 0",
  "quantityUnit?": "string",
  "label?": "string",
  "nutritionSnapshot?": "string.json",
});

export const createFoodLogEntrySchema = foodLogEntryBaseSchema.and(
  foodLogSourceSchema,
);

export const updateFoodLogEntrySchema = type({
  "user?": stubSchema(userSchema),
  "date?": "Date",
  "mealType?": mealTypeSchema,
  "loggedAt?": "Date",
  "servings?": "number > 0 | null",
  "quantity?": "number > 0 | null",
  "quantityUnit?": "string | null",
  "label?": "string | null",
  "nutritionSnapshot?": "string.json | null",
  "recipe?": stubSchema(recipeSchema).or("null"),
  "ingredient?": stubSchema(ingredientSchema).or("null"),
});
export const foodLogEntrySchema = createFoodLogEntrySchema.and(
  serverGeneratedFields,
);

export type CreateFoodLogEntry = typeof createFoodLogEntrySchema.infer;
export type UpdateFoodLogEntry = typeof updateFoodLogEntrySchema.infer;
export type FoodLogEntry = typeof foodLogEntrySchema.infer;
