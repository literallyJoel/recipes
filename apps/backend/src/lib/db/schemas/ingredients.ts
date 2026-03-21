import { type } from "arktype";

export const ingredientDbRowSchema = type({
  id: "string.uuid",
  "storeId?": "string.uuid | null",
  "ingredientTagId?": "string.uuid | null",
  name: "string",
  brand: "string",
  "priceAmount?": "number.integer | null",
  "priceCurrency?": "string == 3 | null",
  "packageSize?": "number | null",
  "packageUnit?": "string | null",
  "url?": "string.url | null",
  baseUnit: "string",
  "customUnitDefinition?": "string | null",
  "energy?": "number>=0 | null",
  "fat?": "number>=0 | null",
  "saturates?": "number>=0 | null",
  "carbohydrates?": "number>=0 | null",
  "sugars?": "number>=0 | null",
  "fibre?": "number>=0 | null",
  "protein?": "number>=0 | null",
  "salt?": "number>=0 | null",
  createdAt: "string",
  updatedAt: "string",
});

export type IngredientDbRow = typeof ingredientDbRowSchema.infer;
