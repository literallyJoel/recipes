import { type } from "arktype";
import { ServerGeneratedFields } from "./common";
import { MealTypeSchema, RecipeSchema } from "./recipes";
import { NutritionSnapshotSchema } from "./nutrition";

export const CreateMealPlanInputSchema = type({
    "nutritionalTargetId?": "string.uuid",
    "storeId?": "string.uuid",
    "label?": "string",
    startDate: "Date",
    endDate: "Date",
    config: "object"
});

export const MealPlanSchema = CreateMealPlanInputSchema.and(
    ServerGeneratedFields
).and(type({ userId: "string.uuid" }));

export const UpdateMealPlanInputSchema = CreateMealPlanInputSchema.partial();

export type CreateMealPlanInput = typeof CreateMealPlanInputSchema.infer;
export type UpdateMealPlanInput = typeof UpdateMealPlanInputSchema.infer;
export type MealPlan = typeof MealPlanSchema.infer;

export const CreateMealPlanEntryInputSchema = type({
    mealPlanId: "string.uuid",
    recipeId: "string.uuid",
    date: "Date",
    mealType: MealTypeSchema,
    servings: "number.integer >= 1",
    order: "number.integer >= 0",
    "nutritionSnapshot?": NutritionSnapshotSchema
});

export const MealPlanEntrySchema = type({
    id: "string.uuid",
    mealPlanId: "string.uuid",
    recipe: RecipeSchema,
    date: "Date",
    mealType: MealTypeSchema,
    servings: "number.integer >= 1",
    order: "number.integer >= 0",
    "nutritionSnapshot?": NutritionSnapshotSchema
});

export const UpdateMealPlanEntryInputSchema =
    CreateMealPlanEntryInputSchema.partial();

export type CreateMealPlanEntryInput =
    typeof CreateMealPlanEntryInputSchema.infer;
export type UpdateMealPlanEntryInput =
    typeof UpdateMealPlanEntryInputSchema.infer;
export type MealPlanEntry = typeof MealPlanEntrySchema.infer;