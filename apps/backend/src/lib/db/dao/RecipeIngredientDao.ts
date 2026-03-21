import { recipeIngredientDbRowSchema, type RecipeIngredientDbRow } from "../schemas";
import { BaseDao } from "./BaseDao";

export type RecipeIngredientRecord = {
  id: string;
  recipeId: string;
  ingredientId: string;
  quantity: number;
  quantityUnit: string;
  notes?: string | null;
  order: number;
};

export type CreateRecipeIngredientRecord = Omit<RecipeIngredientRecord, "id">;
export type UpdateRecipeIngredientRecord = Partial<
  Omit<RecipeIngredientRecord, "id" | "recipeId">
>;

export class RecipeIngredientDao extends BaseDao<
  RecipeIngredientDbRow,
  RecipeIngredientRecord,
  CreateRecipeIngredientRecord,
  UpdateRecipeIngredientRecord,
  "id"
> {
  constructor() {
    super({
      table: "recipe_ingredients",
      primaryKey: "id",
      rowSchema: recipeIngredientDbRowSchema,
      defaultOrderBy: [{ field: "order", direction: "asc" }],
      createPrimaryKey: () => crypto.randomUUID(),
      fromRow: (row) => ({
        id: row.id,
        recipeId: row.recipeId,
        ingredientId: row.ingredientId,
        quantity: row.quantity,
        quantityUnit: row.quantityUnit,
        notes: row.notes,
        order: row.order,
      }),
      toRow: mapRecipeIngredientRow,
    });
  }
}

function mapRecipeIngredientRow(
  input: CreateRecipeIngredientRecord | UpdateRecipeIngredientRecord,
) {
  return {
    recipeId: "recipeId" in input ? input.recipeId : undefined,
    ingredientId: input.ingredientId,
    quantity: input.quantity,
    quantityUnit: input.quantityUnit,
    notes: input.notes,
    order: input.order,
  };
}

export const recipeIngredientDao = new RecipeIngredientDao();
