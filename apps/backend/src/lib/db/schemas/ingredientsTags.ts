import { type } from "arktype";

export const ingredientTagDbRowSchema = type({
    id: "string.uuid",
    name: "string",
    createdAt: "string",
    updatedAt: "string",
});

export type IngredientTagDBRow = typeof ingredientTagDbRowSchema.infer;