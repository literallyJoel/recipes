import { type } from "arktype";
import { ServerGeneratedFields } from "./common";
import { StoreSchema } from "./stores";

export const CreateIngredientTagInputSchema = type({
  name: "string",
});

export const IngredientTagSchema = CreateIngredientTagInputSchema.and(
  ServerGeneratedFields,
);

export const UpdateIngredientTagInputSchema =
  CreateIngredientTagInputSchema.partial();

export type CreateIngredientTagInput =
  typeof CreateIngredientTagInputSchema.infer;
export type UpdateIngredientTagInput =
  typeof UpdateIngredientTagInputSchema.infer;
export type IngredientTag = typeof IngredientTagSchema.infer;

export const IngredientNutritionSchema = type({
  baseUnit: "string",
  "customUnitDefinition?": "string",
  "energyPerBaseUnit?": "number",
  "fatPerBaseUnit?": "number",
  "saturatesPerBaseUnit?": "number",
  "carbohydratesPerBaseUnit?": "number",
  "sugarsPerBaseUnit?": "number",
  "fibrePerBaseUnit?": "number",
  "proteinPerBaseUnit?": "number",
  "saltPerBaseUnit?": "number",
});

export type IngredientNutrition = typeof IngredientNutritionSchema.infer;

export const CreateIngredientInputSchema = type({
  "storeId?": "string.uuid",
  "ingredientTagId?": "string.uuid",
  name: "string",
  brand: "string",
  "priceAmount?": "number",
  priceCurrency: "string == 3",
  "packageSize?": "number",
  "packageUnit?": "string",
  "url?": "string.url",
  nutrition: IngredientNutritionSchema.optional(),
});

export const IngredientSchema = type({
  "store?": StoreSchema,
  "ingredientTag?": IngredientTagSchema,
  name: "string",
  brand: "string",
  "priceAmount?": "number",
  priceCurrency: "string == 3",
  "packageSize?": "number",
  "packageUnit?": "string",
  "url?": "string.url",
  nutrition: IngredientNutritionSchema.optional(),
}).and(ServerGeneratedFields);

export const UpdateIngredientInputSchema =
  CreateIngredientInputSchema.partial();

export type CreateIngredientInput = typeof CreateIngredientInputSchema.infer;
export type UpdateIngredientInput = typeof UpdateIngredientInputSchema.infer;
export type Ingredient = typeof IngredientSchema.infer;
