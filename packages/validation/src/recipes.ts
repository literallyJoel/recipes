import { type } from "arktype";
import { ServerGeneratedFields, stubSchema } from "./common";
import { IngredientSchema } from "./ingredients";
import { userSchema } from "./users";

export const createRecipeSchema = type({
  title: "string",
  "description?": "string",
  "instructions?": "string",
  servings: "number.integer",
  "prepMins?": "number.integer",
  "cookMins?": "number.integer",
  isPublic: "boolean",
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const recipeSchema = createRecipeSchema
  .and(ServerGeneratedFields)
  .and({ user: { id: "string" } })
  .and({ "ingredients?": IngredientSchema.array() });

export const sharedRecipeSchema = recipeSchema.and({
  sharedByUser: stubSchema(userSchema),
});

export type CreateRecipe = typeof createRecipeSchema.infer;
export type UpdateRecipe = typeof updateRecipeSchema.infer;
export type Recipe = typeof recipeSchema.infer;
export type SharedRecipe = typeof sharedRecipeSchema.infer;
