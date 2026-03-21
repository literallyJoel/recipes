import type { CreateRecipe, Recipe, UpdateRecipe } from "@jvrecipes/validation";
import type { RecipeDbRow } from "../schemas";
import { recipeDBRowSchema } from "../schemas";
import { BaseDao } from "./BaseDao";

export type RecipeRecord = Omit<Recipe, "user" | "ingredients"> & {
  userId: string;
};

export type CreateRecipeRecord = CreateRecipe & {
  userId: string;
};

export type UpdateRecipeRecord = UpdateRecipe;

export class RecipeDao extends BaseDao<
  RecipeDbRow,
  RecipeRecord,
  CreateRecipeRecord,
  UpdateRecipeRecord,
  "id"
> {
  constructor() {
    super({
      table: "recipes",
      primaryKey: "id",
      rowSchema: recipeDBRowSchema,
      defaultOrderBy: [{ field: "updatedAt", direction: "desc" }],
      createPrimaryKey: () => crypto.randomUUID(),
      fromRow: (row) => ({
        id: row.id,
        userId: row.userId,
        title: row.title,
        description: row.description ?? undefined,
        instructions: row.instructions ?? undefined,
        servings: row.servings ?? 1,
        prepMins: row.prepMins ?? undefined,
        cookMins: row.cookMins ?? undefined,
        isPublic: row.isPublic,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }),
      toRow: (input) => ({
        userId: "userId" in input ? input.userId : undefined,
        title: input.title,
        description: input.description,
        instructions: input.instructions,
        servings: input.servings,
        prepMins: input.prepMins,
        cookMins: input.cookMins,
        isPublic: input.isPublic,
      }),
    });
  }
}

export const recipeDao = new RecipeDao();
