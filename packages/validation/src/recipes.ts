import { type } from "arktype";
import { serverGeneratedFields, stubSchema } from "./common";
import { ingredientSchema } from "./ingredients";
import { userSchema } from "./users";

/**
 * Ingredient usage within a recipe, including quantity metadata and a hydrated
 * ingredient stub.
 */
export const recipeIngredientSchema = type({
  quantity: "number",
  quantityUnit: "string",
  "notes?": "string | null",
  order: "number.integer >= 0",
  ingredient: stubSchema(ingredientSchema),
}).and({
  id: "string.uuid",
});

/**
 * Client-supplied fields required to create a recipe.
 */
export const createRecipeSchema = type({
  title: "string",
  "description?": "string",
  "instructions?": "string",
  servings: "number > 0",
  "prepMins?": "number.integer >= 0",
  "cookMins?": "number.integer >= 0",
  isPublic: "boolean",
});

/**
 * Partial recipe updates, including explicit nulls for clearable optional
 * fields.
 */
export const updateRecipeSchema = type({
  "title?": "string",
  "description?": "string | null",
  "instructions?": "string | null",
  "servings?": "number > 0",
  "prepMins?": "number.integer >= 0 | null",
  "cookMins?": "number.integer >= 0 | null",
  "isPublic?": "boolean",
});

/**
 * Full recipe entity shape exposed to the app layer.
 */
export const recipeSchema = createRecipeSchema
  .and(serverGeneratedFields)
  .and({ user: stubSchema(userSchema) })
  .and({ "ingredients?": recipeIngredientSchema.array() });

export type CreateRecipe = typeof createRecipeSchema.infer;
export type UpdateRecipe = typeof updateRecipeSchema.infer;
export type RecipeIngredient = typeof recipeIngredientSchema.infer;
export type Recipe = typeof recipeSchema.infer;
