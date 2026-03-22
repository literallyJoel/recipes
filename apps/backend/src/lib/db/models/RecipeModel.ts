import type { Recipe, RecipeIngredient } from "@jvrecipes/validation";
import { queryDb } from "../client";
import { ingredientDao, type IngredientRecord } from "../dao/IngredientDao";
import { recipeDao } from "../dao/RecipeDao";
import { recipeIngredientDao } from "../dao/RecipeIngredientDao";
import { recipeDBRowSchema } from "../schemas";
import { BaseModel } from "./BaseModel";

const sharedRecipeWithUsersDbRowSchema = recipeDBRowSchema.and({
  sharedRowId: "string.uuid",
  sharedById: "string",
  sharedWithId: "string",
  sharedCanEdit: "boolean",
  sharedCreatedAt: "string",
  userName: "string",
  userImage: "string | null",
});

type SharedRecipeWithUsersDbRow = typeof sharedRecipeWithUsersDbRowSchema.infer;

/**
 * Recipe read model.
 * Owns composed reads that span multiple tables, such as ingredient hydration
 * and "recipes shared with this user" queries.
 */
export class RecipeModel extends BaseModel {
  async getAll(userId: string): Promise<Recipe[]> {
    return await recipeDao.read(
      {
        where: {
          and: [
            { field: "userId", value: userId },
            { field: "deletedAt", op: "is null" },
          ],
        },
      },
      this.client,
    );
  }

  async get(
    recipeId: string,
    userId: string,
    options: { includeIngredients?: boolean } = {},
  ): Promise<Recipe | null> {
    const [recipe] = await recipeDao.read(
      {
        where: {
          and: [
            { field: "userId", value: userId },
            { field: "id", value: recipeId },
            { field: "deletedAt", op: "is null" },
          ],
        },
        limit: 1,
      },
      this.client,
    );

    if (!recipe) {
      return null;
    }

    if (!options.includeIngredients) {
      return recipe;
    }

    return await this.withIngredients(recipe);
  }

  async create(
    userId: string,
    input: Omit<Parameters<typeof recipeDao.create>[0], "userId">,
  ): Promise<Recipe> {
    const createdRecipe = await recipeDao.create(
      {
        ...input,
        userId,
      },
      this.client,
    );

    const [recipe] = await recipeDao.read(
      {
        where: {
          and: [
            { field: "userId", value: userId },
            { field: "id", value: createdRecipe.id },
            { field: "deletedAt", op: "is null" },
          ],
        },
        limit: 1,
      },
      this.client,
    );

    if (!recipe) {
      throw new Error(
        `Failed to reload recipe "${createdRecipe.id}" after creation`,
      );
    }

    return recipe;
  }

  async getAllShared(userId: string): Promise<Recipe[]> {
    return await this.readSharedRecipes(userId);
  }

  async getShared(
    recipeId: string,
    userId: string,
    options: { includeIngredients?: boolean } = {},
  ): Promise<Recipe | null> {
    const [recipe] = await this.readSharedRecipes(userId, {
      recipeId,
      limit: 1,
    });

    if (!recipe) {
      return null;
    }

    if (!options.includeIngredients) {
      return recipe;
    }

    return await this.withIngredients(recipe);
  }

  /**
   * Reuse the standard ingredient hydration flow for both owned and shared
   * recipe reads.
   */
  private async withIngredients<TRecipe extends Recipe>(
    recipe: TRecipe,
  ): Promise<TRecipe> {
    const recipeIngredients = await recipeIngredientDao.read(
      {
        where: {
          field: "recipeId",
          value: recipe.id,
        },
        orderBy: [{ field: "order", direction: "asc" }],
      },
      this.client,
    );

    const ingredientIds = recipeIngredients.map((item) => item.ingredientId);

    const ingredients =
      ingredientIds.length === 0
        ? []
        : await ingredientDao.read(
            {
              where: {
                field: "id",
                op: "in",
                value: ingredientIds,
              },
            },
            this.client,
          );

    return {
      ...recipe,
      ingredients: hydrateRecipeIngredients(recipeIngredients, ingredients),
    };
  }

  /**
   * Read recipes shared with a user directly from the model layer.
   * This stays out of the DAO layer because the result is a composed read model
   * spanning `shared_recipes`, `recipes`, and `user`, rather than a single
   * table-backed persistence object.
   */
  private async readSharedRecipes(
    sharedWithId: string,
    options: {
      recipeId?: string;
      limit?: number;
    } = {},
  ): Promise<Recipe[]> {
    const values: unknown[] = [sharedWithId];
    const conditions = [`sr."sharedWithId" = $1`, `r."deletedAt" is null`];

    if (options.recipeId) {
      values.push(options.recipeId);
      conditions.push(`r."id" = $${values.length}`);
    }

    const limitClause = buildLimitClause(options.limit, values);
    const rows = await queryDb<SharedRecipeWithUsersDbRow>(
      `SELECT r.*,
                sr."id" AS "sharedRowId",
                sr."sharedById",
                sr."sharedWithId",
                sr."canEdit" AS "sharedCanEdit",
                sr."createdAt" AS "sharedCreatedAt",
                ou."name" AS "userName",
                ou."image" AS "userImage",
           FROM "shared_recipes" sr,
     INNER JOIN "recipes" r
             ON r."id" = sr."recipeId"
     INNER JOIN "user" ou
             ON ou."id" = r."userId"
          WHERE ${conditions.join(" AND ")}
       ORDER BY r."updatedAt" desc,
                ${limitClause}`,
      values,
      this.client,
    );

    return rows.map((row) => this.fromSharedRecipeRow(row));
  }

  private fromSharedRecipeRow(row: SharedRecipeWithUsersDbRow): Recipe {
    const validatedRow = sharedRecipeWithUsersDbRowSchema.assert(
      row,
    ) as SharedRecipeWithUsersDbRow;

    return {
      id: validatedRow.id,
      title: validatedRow.title,
      description: validatedRow.description ?? undefined,
      instructions: validatedRow.instructions ?? undefined,
      servings: validatedRow.servings ?? 1,
      prepMins: validatedRow.prepMins ?? undefined,
      cookMins: validatedRow.cookMins ?? undefined,
      isPublic: validatedRow.isPublic,
      createdAt: new Date(validatedRow.createdAt),
      updatedAt: new Date(validatedRow.updatedAt),
      user: {
        id: validatedRow.userId,
        name: validatedRow.userName,
        image: validatedRow.userImage ?? undefined,
      },
    };
  }
}

/**
 * Merge recipe ingredient link rows with their referenced ingredient records.
 */
function hydrateRecipeIngredients(
  recipeIngredients: Awaited<ReturnType<typeof recipeIngredientDao.read>>,
  ingredients: IngredientRecord[],
): RecipeIngredient[] {
  const ingredientsById = new Map(
    ingredients.map((ingredient) => [ingredient.id, ingredient]),
  );

  return recipeIngredients.flatMap((item) => {
    const ingredient = ingredientsById.get(item.ingredientId);

    if (!ingredient) {
      return [];
    }

    return [
      {
        id: item.id,
        quantity: item.quantity,
        quantityUnit: item.quantityUnit,
        notes: item.notes,
        order: item.order,
        ingredient: {
          id: ingredient.id,
          name: ingredient.name,
          brand: ingredient.brand,
          priceAmount: ingredient.priceAmount,
          priceCurrency: ingredient.priceCurrency,
          packageSize: ingredient.packageSize,
          url: ingredient.url,
          nutrition: ingredient.nutrition,
          createdAt: ingredient.createdAt,
          updatedAt: ingredient.updatedAt,
        },
      },
    ];
  });
}

export const recipeModel = new RecipeModel();

function buildLimitClause(
  limit: number | undefined,
  values: unknown[],
): string {
  if (typeof limit !== "number") {
    return "";
  }

  values.push(limit);
  return `limit $${values.length}`;
}
