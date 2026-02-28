import { type } from "arktype";

export const ingredientDbRowSchema = type({
  id: "string.uuid",
  "storeId?": "string.uuid",
  "ingredientTagId?": "string.uuid",
  name: "string",
  brand: "string",
  "priceAmount?": "number.integer",
  "priceCurrency?": "string == 3",
  "packageSize?": "number",
  "packageUnit?": "string",
  "url?": "string.url",
  baseUnit: "string",
  "customUnitDefinition?": "string",
  "energy?": "number>0",
  "fat?": "number>0",
  "saturates?": "number>0",
  "carbohydrates?": "number>0",
  "sugars?": "number>0",
  "fibre?": "number>0",
  "protein?": "number>0",
  "salt?": "number>0",
  createdAt: "string",
  updatedAt: "string",
});

export type IngredientDbRow = typeof ingredientDbRowSchema.infer;
