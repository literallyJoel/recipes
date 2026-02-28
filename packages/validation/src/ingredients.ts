import { type } from "arktype";
import { storeSchema } from "./stores";
import { serverGeneratedFields, stubSchema } from "./common";

// Ingredient Tags
export const createIngredientTagSchema = type({
  name: "string",
});

export const updateIngredientTagSchema = createIngredientTagSchema.partial();

export const ingredientTagSchema = createIngredientTagSchema.and(
  serverGeneratedFields,
);

export type CreateIngredientTag = typeof createIngredientTagSchema.infer;
export type UpdateIngredientTag = typeof updateIngredientTagSchema.infer;
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
  "store?": stubSchema(storeSchema),
  "ingredientTag?": stubSchema(ingredientTagSchema),
  "priceAmount?": "number.integer",
  "priceCurrency?": "string == 3",
  "packageSize?": "number",
  "url?": "string.url",
  "nutrition?": ingredientNutritionSchema,
});

export const updateIngredientSchema = createIngredientSchema.partial();

export const ingredientSchema = createIngredientSchema.and(
  serverGeneratedFields,
);

export type IngredientNutrition = typeof ingredientNutritionSchema.infer;
export type CreateIngredient = typeof createIngredientSchema.infer;
export type UpdateIngredient = typeof updateIngredientSchema.infer;
export type Ingredient = typeof ingredientSchema.infer;
