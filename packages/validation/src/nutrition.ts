import { type } from "arktype";
import { serverGeneratedFields, stubSchema } from "./common";
import { userSchema } from "./users";

export const createNutritionalTargetSchema = type({
  label: "string",
  user: stubSchema(userSchema),
  "calories?": "number",
  "protein?": "number",
  "carbs?": "number",
  "fat?": "number",
  "fibre?": "number",
  isDefault: "boolean",
});

export const updateNutritionalTargetSchema =
  createNutritionalTargetSchema.partial();

export const nutritionalTargetSchema = createNutritionalTargetSchema.and(
  serverGeneratedFields,
);

export type CreateNutritionalTarget =
  typeof createNutritionalTargetSchema.infer;
export type UpdateNutritionalTarget = typeof updateNutritionalTargetSchema.infer;
export type NutritionalTarget = typeof nutritionalTargetSchema.infer;
