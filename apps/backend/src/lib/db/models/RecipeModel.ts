import type { Recipe, RecipeIngredient, SharedRecipe } from "@jvrecipes/validation";
import { ingredientDao, type IngredientRecord } from "../dao/IngredientDao";
import { recipeDao } from "../dao/RecipeDao";
import { recipeIngredientDao } from "../dao/RecipeIngredientDao";
import { sharedRecipeDao } from "../dao/SharedRecipeDao";
import { BaseModel } from "./BaseModel";

export class RecipeModel extends BaseModel {
  async getAll(userId: string): Promise<Recipe[]> {
    return await recipeDao.read({
      where: {
        and: [
          { field: "userId", value: userId },
          { field: "deletedAt", op: "is null" },
        ],
      },
    }, this.client);
  }

  async get(
    recipeId: string,
    userId: string,
    options: { includeIngredients?: boolean } = {},
  ): Promise<Recipe | null> {
    const [recipe] = await recipeDao.read({
      where: {
        and: [
          { field: "userId", value: userId },
          { field: "id", value: recipeId },
          { field: "deletedAt", op: "is null" },
        ],
      },
      limit: 1,
    }, this.client);

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
    const createdRecipe = await recipeDao.create({
      ...input,
      userId,
    }, this.client);

    const [recipe] = await recipeDao.read({
      where: {
        and: [
          { field: "userId", value: userId },
          { field: "id", value: createdRecipe.id },
          { field: "deletedAt", op: "is null" },
        ],
      },
      limit: 1,
    }, this.client);

    if (!recipe) {
      throw new Error(`Failed to reload recipe "${createdRecipe.id}" after creation`);
    }

    return recipe;
  }

  async getAllShared(userId: string): Promise<SharedRecipe[]> {
    return await sharedRecipeDao.readSharedWithUsers(userId, {}, this.client);
  }

  async getShared(
    recipeId: string,
    userId: string,
    options: { includeIngredients?: boolean } = {},
  ): Promise<SharedRecipe | null> {
    const [recipe] = await sharedRecipeDao.readSharedWithUsers(userId, {
      recipeId,
      limit: 1,
    }, this.client);

    if (!recipe) {
      return null;
    }

    if (!options.includeIngredients) {
      return recipe;
    }

    return await this.withIngredients(recipe);
  }

  private async withIngredients<TRecipe extends Recipe | SharedRecipe>(
    recipe: TRecipe,
  ): Promise<TRecipe> {
    const recipeIngredients = await recipeIngredientDao.read({
      where: {
        field: "recipeId",
        value: recipe.id,
      },
      orderBy: [{ field: "order", direction: "asc" }],
    }, this.client);

    const ingredientIds = recipeIngredients.map((item) => item.ingredientId);

    const ingredients =
      ingredientIds.length === 0
        ? []
        : await ingredientDao.read({
            where: {
              field: "id",
              op: "in",
              value: ingredientIds,
            },
          }, this.client);

    return {
      ...recipe,
      ingredients: hydrateRecipeIngredients(recipeIngredients, ingredients),
    };
  }
}

function hydrateRecipeIngredients(
  recipeIngredients: Awaited<ReturnType<typeof recipeIngredientDao.read>>,
  ingredients: IngredientRecord[],
): RecipeIngredient[] {
  const ingredientsById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));

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
