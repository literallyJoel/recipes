import { type } from "arktype";

export const mealPlanDbRowSchema = type({
  id: "string.uuid",
  userId: "string",
  "nutritionalTargetId?": "string.uuid | null",
  "storeId?": "string.uuid | null",
  "label?": "string | null",
  startDate: "string.date",
  endDate: "string.date",
  config: "string.json",
  createdAt: "string",
  updatedAt: "string",
});

export type MealPlanDbRow = typeof mealPlanDbRowSchema.infer;
