import { type } from "arktype";
import { ServerGeneratedFields } from "./common";
import { IngredientSchema } from "./ingredients";

export const MealTypeSchema = type(
    "'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drinks'"
);

export type MealType = typeof MealTypeSchema.infer;

export const CreateRecipeInputSchema = type({
    title: "string",
    "description?": "string",
    "instructions?": "string",
    servings: "number.integer >= 1",
    "prepMins?": "number.integer >= 0",
    "cookMins?": "number.integer >= 0",
    isPublic: "boolean"
});

export const RecipeSchema = CreateRecipeInputSchema.and(
    ServerGeneratedFields
).and(
    type({
        userId: "string.uuid",
        "deletedAt?": "Date"
    })
);

export const UpdateRecipeInputSchema = CreateRecipeInputSchema.partial();

export type CreateRecipeInput = typeof CreateRecipeInputSchema.infer;
export type UpdateRecipeInput = typeof UpdateRecipeInputSchema.infer;
export type Recipe = typeof RecipeSchema.infer;

export const CreateRecipeIngredientInputSchema = type({
    ingredientId: "string.uuid",
    quantity: "number > 0",
    quantityUnit: "string",
    "notes?": "string",
    order: "number.integer >= 0"
});

export const RecipeIngredientSchema = type({
    id: "string.uuid",
    recipeId: "string.uuid",
    ingredient: IngredientSchema,
    quantity: "number > 0",
    quantityUnit: "string",
    "notes?": "string",
    order: "number.integer >= 0"
});

export const UpdateRecipeIngredientInputSchema =
    CreateRecipeIngredientInputSchema.partial();

export type CreateRecipeIngredientInput =
    typeof CreateRecipeIngredientInputSchema.infer;
export type UpdateRecipeIngredientInput =
    typeof UpdateRecipeIngredientInputSchema.infer;
export type RecipeIngredient = typeof RecipeIngredientSchema.infer;

export const CreateSharedRecipeInputSchema = type({
    recipeId: "string.uuid",
    sharedWithId: "string.uuid",
    canEdit: "boolean"
});

export const SharedRecipeSchema = CreateSharedRecipeInputSchema.and(
    type({
        id: "string.uuid",
        sharedById: "string.uuid",
        createdAt: "Date"
    })
);

export const UpdateSharedRecipeInputSchema = type({
    canEdit: "boolean"
});

export type CreateSharedRecipeInput = typeof CreateSharedRecipeInputSchema.infer;
export type UpdateSharedRecipeInput = typeof UpdateSharedRecipeInputSchema.infer;
export type SharedRecipe = typeof SharedRecipeSchema.infer;