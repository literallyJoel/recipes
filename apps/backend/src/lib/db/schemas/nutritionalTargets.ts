import { type } from "arktype";

export const nutritionalTargetDbRowSchema = type({
  id: "string.uuid",
  userId: "string",
  label: "string",
  "calories?": "number>=0 | null",
  "protein?": "number>=0 | null",
  "carbs?": "number>=0 | null",
  "fat?": "number>=0 | null",
  "fibre?": "number>=0 | null",
  isDefault: "boolean",
  createdAt: "string",
  updatedAt: "string",
});

export type NutritionalTargetDbRow = typeof nutritionalTargetDbRowSchema.infer;
