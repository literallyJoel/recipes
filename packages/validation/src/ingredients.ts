import { type } from "arktype";
import { StoreSchema } from "./stores";
import { ServerGeneratedFields, stubSchema } from "./common";

// Ingredient Tags
export const createIngrientTagSchema = type({
  name: "string",
});

export const updateIngredientTagSchema = createIngrientTagSchema.partial();

export const ingredientTagSchema = createIngrientTagSchema.and(
  ServerGeneratedFields,
);

export type CreateIngredientTag = typeof createIngrientTagSchema.infer;
export type updateIngredientTag = typeof updateIngredientTagSchema.infer;
export type IngredientTag = typeof ingredientTagSchema.infer;

// Ingredients

export const ingredientNutritionSchema = type({
  energy: "number",
  fat: "number",
  saturates: "number",
  carbohydrates: "number",
  sugars: "number",
  fibre: "number",
  protein: "number",
  salt: "number",
}).partial();

export const createIngredientSchema = type({
  name: "string",
  brand: "string",
  "store?": stubSchema(StoreSchema),
  "ingredientTag?": stubSchema(ingredientTagSchema),
  "priceAmount?": "number.integer",
  "priceCurrency?": "string == 3",
  "packageSize?": "number",
  "url?": "string.url",
  "nutrition?": ingredientNutritionSchema,
});

export const updateIngredientSchema = createIngredientSchema.partial();

export const IngredientSchema = createIngrientTagSchema.and(
  ServerGeneratedFields,
);

export type IngredientNutrition = typeof ingredientNutritionSchema.infer;
export type CreateIngredient = typeof createIngredientSchema.infer;
export type UpdateIngredient = typeof updateIngredientSchema.infer;
export type Ingredient = typeof IngredientSchema.infer;
