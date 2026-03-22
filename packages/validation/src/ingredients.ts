import { type } from "arktype";
import { storeSchema } from "./stores";
import { serverGeneratedFields, stubSchema } from "./common";

// Ingredient Tags

/**
 * Client-supplied fields required to create an ingredient tag.
 */
export const createIngredientTagSchema = type({
  name: "string",
});

/**
 * Partial ingredient tag updates.
 */
export const updateIngredientTagSchema = createIngredientTagSchema.partial();

/**
 * Full ingredient tag entity shape including server-generated fields.
 */
export const ingredientTagSchema = createIngredientTagSchema.and(
  serverGeneratedFields,
);

export type CreateIngredientTag = typeof createIngredientTagSchema.infer;
export type UpdateIngredientTag = typeof updateIngredientTagSchema.infer;
export type IngredientTag = typeof ingredientTagSchema.infer;

// Ingredients

/**
 * Per-nutrient values stored for an ingredient.
 * Individual keys are optional and nullable so update payloads can clear a
 * single nutrient without replacing the entire object.
 */
export const ingredientNutritionSchema = type({
  energy: "number | null",
  fat: "number | null",
  saturates: "number | null",
  carbohydrates: "number | null",
  sugars: "number | null",
  fibre: "number | null",
  protein: "number | null",
  salt: "number | null",
}).partial();

/**
 * Client-supplied fields required to create an ingredient.
 */
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

/**
 * Partial ingredient updates, including explicit nulls for clearable fields.
 */
export const updateIngredientSchema = type({
  "name?": "string",
  "brand?": "string",
  "store?": stubSchema(storeSchema).or("null"),
  "ingredientTag?": stubSchema(ingredientTagSchema).or("null"),
  "priceAmount?": "number.integer | null",
  "priceCurrency?": "string == 3 | null",
  "packageSize?": "number | null",
  "url?": "string.url | null",
  "nutrition?": ingredientNutritionSchema.or("null"),
});

/**
 * Full ingredient entity shape exposed to the app layer.
 */
export const ingredientSchema = createIngredientSchema.and(
  serverGeneratedFields,
);

export type IngredientNutrition = typeof ingredientNutritionSchema.infer;
export type CreateIngredient = typeof createIngredientSchema.infer;
export type UpdateIngredient = typeof updateIngredientSchema.infer;
export type Ingredient = typeof ingredientSchema.infer;
