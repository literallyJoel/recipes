import { type } from "arktype";
import { serverGeneratedFields, stubSchema } from "./common";
import { ingredientSchema } from "./ingredients";
import { userSchema } from "./users";

export const createRecipeSchema = type({
  title: "string",
  "description?": "string",
  "instructions?": "string",
  servings: "number > 0",
  "prepMins?": "number.integer >= 0",
  "cookMins?": "number.integer >= 0",
  isPublic: "boolean",
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const recipeSchema = createRecipeSchema
  .and(serverGeneratedFields)
  .and({ user: stubSchema(userSchema) })
  .and({ "ingredients?": ingredientSchema.array() });

export const sharedRecipeSchema = recipeSchema.and({
  sharedByUser: stubSchema(userSchema),
});

export type CreateRecipe = typeof createRecipeSchema.infer;
export type UpdateRecipe = typeof updateRecipeSchema.infer;
export type Recipe = typeof recipeSchema.infer;
export type SharedRecipe = typeof sharedRecipeSchema.infer;
