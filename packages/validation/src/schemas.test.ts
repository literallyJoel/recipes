import { describe, expect, it } from "bun:test";
import type { ArkErrors } from "arktype";
import {
  createFoodLogEntrySchema,
  createIngredientSchema,
  createMealPlanEntrySchema,
  recipeSchema,
  updateIngredientSchema,
  userSchema,
} from "./index";
import { stubSchema } from "./common";

function expectArkErrors(value: unknown): ArkErrors {
  expect(value).toHaveProperty("summary");
  return value as ArkErrors;
}

describe("validation schemas", () => {
  it("stubSchema requires an id and allows partial related fields", () => {
    const userStub = stubSchema(userSchema);

    expect(userStub({ id: "user-123" })).toEqual({ id: "user-123" });
    expect(userStub({ id: "user-123", email: "joel@example.com" })).toEqual({
      id: "user-123",
      email: "joel@example.com",
    });

    const missingId = userStub({ email: "joel@example.com" });
    expect(expectArkErrors(missingId).summary).toContain("id");
  });

  it("enforces create vs update rules for ingredient relations and clearable fields", () => {
    expect(
      createIngredientSchema({
        name: "Greek yogurt",
        brand: "Fage",
        store: { id: crypto.randomUUID() },
        ingredientTag: { id: crypto.randomUUID(), name: "Dairy" },
        priceCurrency: "GBP",
      }),
    ).toEqual({
      name: "Greek yogurt",
      brand: "Fage",
      store: expect.objectContaining({ id: expect.any(String) }),
      ingredientTag: expect.objectContaining({
        id: expect.any(String),
        name: "Dairy",
      }),
      priceCurrency: "GBP",
    });

    const invalidCreate = createIngredientSchema({
      name: "Greek yogurt",
      brand: "Fage",
      store: null,
      priceCurrency: "GB",
    });
    expect(expectArkErrors(invalidCreate).summary).toContain(
      "store must be an object",
    );
    expect(expectArkErrors(invalidCreate).summary).toContain("priceCurrency");

    expect(
      updateIngredientSchema({
        store: null,
        ingredientTag: null,
        priceAmount: null,
        nutrition: null,
      }),
    ).toEqual({
      store: null,
      ingredientTag: null,
      priceAmount: null,
      nutrition: null,
    });
  });

  it("prevents food log entries from pointing at both a recipe and an ingredient", () => {
    const baseEntry = {
      user: { id: "user-1" },
      date: new Date("2026-03-01T00:00:00.000Z"),
      mealType: "lunch",
      loggedAt: new Date("2026-03-01T12:00:00.000Z"),
    } as const;

    const validRecipeEntry = createFoodLogEntrySchema({
      ...baseEntry,
      recipe: { id: crypto.randomUUID(), title: "Soup" },
      servings: 2,
    });
    expect(validRecipeEntry).toEqual({
      ...baseEntry,
      recipe: expect.objectContaining({ title: "Soup" }),
      servings: 2,
    });

    const invalidDualSource = createFoodLogEntrySchema({
      ...baseEntry,
      recipe: { id: crypto.randomUUID() },
      ingredient: { id: crypto.randomUUID() },
    });
    expect(expectArkErrors(invalidDualSource).summary).toContain("never");
  });

  it("enforces nested recipe and meal plan entry constraints", () => {
    const recipe = recipeSchema({
      id: crypto.randomUUID(),
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      updatedAt: new Date("2026-02-01T00:00:00.000Z"),
      title: "Overnight oats",
      servings: 1,
      isPublic: false,
      user: { id: "user-1", email: "joel@example.com" },
      ingredients: [
        {
          id: crypto.randomUUID(),
          quantity: 100,
          quantityUnit: "g",
          order: 0,
          ingredient: { id: crypto.randomUUID(), name: "Oats" },
        },
      ],
    });

    expect(recipe).toEqual(
      expect.objectContaining({
        title: "Overnight oats",
        ingredients: [
          expect.objectContaining({
            quantity: 100,
            ingredient: expect.objectContaining({ name: "Oats" }),
          }),
        ],
      }),
    );

    const invalidMealPlanEntry = createMealPlanEntrySchema({
      mealPlan: { id: crypto.randomUUID() },
      recipe: { id: crypto.randomUUID() },
      date: new Date("2026-03-02T00:00:00.000Z"),
      mealType: "brunch",
      servings: 0,
      order: 0,
      nutritionSnapshot: "{\"calories\": 500}",
    });
    expect(expectArkErrors(invalidMealPlanEntry).summary).toContain("mealType");
    expect(expectArkErrors(invalidMealPlanEntry).summary).toContain("servings");
  });
});
