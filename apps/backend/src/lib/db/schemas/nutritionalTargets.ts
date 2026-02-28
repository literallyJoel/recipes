import { type } from "arktype";

export const nutritionalTargetDbRowSchema = type({
  id: "string.uuid",
  userId: "string",
  label: "string",
  "calories?": "number>0",
  "protein?": "number>0",
  "carbs?": "number>0",
  "fat?": "number>0",
  "fibre?": "number>0",
  isDefault: "boolean",
  createdAt: "string",
  updatedAt: "string",
});

export type NutritionalTargetDbRow = typeof nutritionalTargetDbRowSchema.infer;
