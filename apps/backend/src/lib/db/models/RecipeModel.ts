import type { Recipe, RecipeIngredient } from "@jvrecipes/validation";
import { ingredientDao, type IngredientRecord } from "../dao/IngredientDao";
import { recipeDao, type RecipeRecord } from "../dao/RecipeDao";
import { recipeIngredientDao } from "../dao/RecipeIngredientDao";
import { BaseModel } from "./BaseModel";

export class RecipeModel extends BaseModel {
  async getAll(userId: string): Promise<Recipe[]> {
    const recipes = await recipeDao.read({
      where: {
        and: [
          { field: "userId", value: userId },
          { field: "deletedAt", op: "is null" },
        ],
      },
    }, this.client);

    return recipes.map((recipe) => this.toRecipe(recipe));
  }

  async get(
    recipeId: string,
    userId: string,
    options: { includeIngredients?: boolean } = {},
  ): Promise<Recipe | null> {
    const [recipe] = await recipeDao.read({
      where: {
        and: [
          { field: "id", value: recipeId },
          { field: "userId", value: userId },
          { field: "deletedAt", op: "is null" },
        ],
      },
      limit: 1,
    }, this.client);

    if (!recipe) {
      return null;
    }

    if (!options.includeIngredients) {
      return this.toRecipe(recipe);
    }

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

    return this.toRecipe(recipe, {
      ingredients: hydrateRecipeIngredients(recipeIngredients, ingredients),
    });
  }

  async create(
    userId: string,
    input: Omit<Parameters<typeof recipeDao.create>[0], "userId">,
  ): Promise<Recipe> {
    const recipe = await recipeDao.create({
      ...input,
      userId,
    }, this.client);

    return this.toRecipe(recipe);
  }

  private toRecipe(
    recipe: RecipeRecord,
    overrides: Partial<Pick<Recipe, "ingredients">> = {},
  ): Recipe {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      servings: recipe.servings,
      prepMins: recipe.prepMins,
      cookMins: recipe.cookMins,
      isPublic: recipe.isPublic,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      user: {
        id: recipe.userId,
      },
      ...overrides,
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
