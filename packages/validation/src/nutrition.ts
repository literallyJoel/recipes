import { type } from "arktype";
import { ServerGeneratedFields } from "./common";

export const NutritionValuesSchema = type({
  "energy?": "number",
  "fat?": "number",
  "saturates?": "number",
  "carbohydrates?": "number",
  "sugars?": "number",
  "fibre?": "number",
  "protein?": "number",
  "salt?": "number",
});

export const NutritionSnapshotSchema = type({
  perServing: NutritionValuesSchema,
});

export const CreateNutritionalTargetInputSchema = type({
  label: "string",
  "calories?": "number",
  "proteinG?": "number",
  "carbsG?": "number",
  "fatG?": "number",
  "fibreG?": "number",
  isDefault: "boolean",
});

export const NutritionalTargetSchema = CreateNutritionalTargetInputSchema.and(
  ServerGeneratedFields,
).and(type({ userId: "string.uuid" }));

export const UpdateNutritionalTargetInputSchema =
  CreateNutritionalTargetInputSchema.partial();

export type NutritionValues = typeof NutritionValuesSchema.infer;
export type NutritionSnapshot = typeof NutritionSnapshotSchema.infer;
export type CreateNutritionalTargetInput =
  typeof CreateNutritionalTargetInputSchema.infer;
export type UpdateNutritionalTargetInput =
  typeof UpdateNutritionalTargetInputSchema.infer;
export type NutritionalTarget = typeof NutritionalTargetSchema.infer;
