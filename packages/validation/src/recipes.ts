import { type } from "arktype";
import { serverGeneratedFields, stubSchema } from "./common";
import { ingredientSchema } from "./ingredients";
import { userSchema } from "./users";

export const recipeIngredientSchema = type({
  quantity: "number",
  quantityUnit: "string",
  "notes?": "string | null",
  order: "number.integer >= 0",
  ingredient: stubSchema(ingredientSchema),
}).and({
  id: "string.uuid",
});

export const createRecipeSchema = type({
  title: "string",
  "description?": "string",
  "instructions?": "string",
  servings: "number > 0",
  "prepMins?": "number.integer >= 0",
  "cookMins?": "number.integer >= 0",
  isPublic: "boolean",
});

export const updateRecipeSchema = type({
  "title?": "string",
  "description?": "string | null",
  "instructions?": "string | null",
  "servings?": "number > 0",
  "prepMins?": "number.integer >= 0 | null",
  "cookMins?": "number.integer >= 0 | null",
  "isPublic?": "boolean",
});

export const recipeSchema = createRecipeSchema
  .and(serverGeneratedFields)
  .and({ user: stubSchema(userSchema) })
  .and({ "ingredients?": recipeIngredientSchema.array() });

export const sharedRecipeSchema = recipeSchema.and({
  sharedByUser: stubSchema(userSchema),
});

export type CreateRecipe = typeof createRecipeSchema.infer;
export type UpdateRecipe = typeof updateRecipeSchema.infer;
export type RecipeIngredient = typeof recipeIngredientSchema.infer;
export type Recipe = typeof recipeSchema.infer;
export type SharedRecipe = typeof sharedRecipeSchema.infer;
