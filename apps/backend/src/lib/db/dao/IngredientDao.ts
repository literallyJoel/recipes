import type { Ingredient, IngredientNutrition } from "@jvrecipes/validation";
import type { IngredientDbRow } from "../schemas";
import { ingredientDbRowSchema } from "../schemas";
import { BaseDao } from "./BaseDao";

export type IngredientRecord = Omit<
  Ingredient,
  "store" | "ingredientTag" | "nutrition"
> & {
  storeId?: string;
  ingredientTagId?: string;
  packageUnit?: string;
  baseUnit: string;
  customUnitDefinition?: string;
  nutrition?: IngredientNutrition;
};

/**
 * Ingredients table DAO.
 * Handles flattening nutrition fields into row columns and rebuilding the
 * optional nutrition object when rows are read back.
 */
export class IngredientDao extends BaseDao<
  IngredientDbRow,
  IngredientRecord,
  Omit<IngredientRecord, "id" | "createdAt" | "updatedAt">,
  Partial<Omit<IngredientRecord, "id" | "createdAt" | "updatedAt">>,
  "id"
> {
  constructor() {
    super({
      table: "ingredients",
      primaryKey: "id",
      rowSchema: ingredientDbRowSchema,
      defaultOrderBy: [{ field: "name", direction: "asc" }],
      createPrimaryKey: () => crypto.randomUUID(),
      fromRow: (row) => ({
        id: row.id,
        storeId: row.storeId ?? undefined,
        ingredientTagId: row.ingredientTagId ?? undefined,
        name: row.name,
        brand: row.brand,
        priceAmount: row.priceAmount ?? undefined,
        priceCurrency: row.priceCurrency ?? undefined,
        packageSize: row.packageSize ?? undefined,
        packageUnit: row.packageUnit ?? undefined,
        url: row.url ?? undefined,
        baseUnit: row.baseUnit,
        customUnitDefinition: row.customUnitDefinition ?? undefined,
        nutrition: buildNutrition(row),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }),
      toRow: (input) => ({
        storeId: input.storeId,
        ingredientTagId: input.ingredientTagId,
        name: input.name,
        brand: input.brand,
        priceAmount: input.priceAmount,
        priceCurrency: input.priceCurrency,
        packageSize: input.packageSize,
        packageUnit: input.packageUnit,
        url: input.url,
        baseUnit: input.baseUnit,
        customUnitDefinition: input.customUnitDefinition,
        energy: input.nutrition?.energy,
        fat: input.nutrition?.fat,
        saturates: input.nutrition?.saturates,
        carbohydrates: input.nutrition?.carbohydrates,
        sugars: input.nutrition?.sugars,
        fibre: input.nutrition?.fibre,
        protein: input.nutrition?.protein,
        salt: input.nutrition?.salt,
      }),
    });
  }
}

/**
 * Rebuild the compact nutrition object from nullable nutrient columns.
 * Returns `undefined` when no nutrient values are present.
 */
function buildNutrition(row: IngredientDbRow): IngredientRecord["nutrition"] {
  const nutrition = {
    energy: row.energy ?? undefined,
    fat: row.fat ?? undefined,
    saturates: row.saturates ?? undefined,
    carbohydrates: row.carbohydrates ?? undefined,
    sugars: row.sugars ?? undefined,
    fibre: row.fibre ?? undefined,
    protein: row.protein ?? undefined,
    salt: row.salt ?? undefined,
  };

  return Object.values(nutrition).some((value) => value !== undefined)
    ? nutrition
    : undefined;
}

export const ingredientDao = new IngredientDao();
