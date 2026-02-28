import { Type, type } from "arktype";

export const serverGeneratedFields = type({
  id: "string.uuid",
  createdAt: "Date",
  updatedAt: "Date",
});

type StubCapableSchema<T extends { id: unknown }> = Type<T> & {
  pick: (key: "id") => Type<Pick<T, "id">>;
  omit: (key: "id") => Type<Omit<T, "id">> & { partial: () => Type<Partial<Omit<T, "id">>> };
};

/**
 * Build a relation-stub schema (`id` required, all other fields optional).
 * These casts are intentional: `Type<T>` does not fully preserve inference
 * through `pick`/`omit`/`partial`, so `stubSchema` narrows via
 * `StubCapableSchema`, `objectSchema`, and then downcasts the merged result
 * to `Type<Pick<T, "id"> & Partial<Omit<T, "id">>>`.
 */
export function stubSchema<T extends { id: unknown }>(schema: Type<T>) {
  const objectSchema = schema as StubCapableSchema<T>;
  return objectSchema
    .pick("id")
    .and(objectSchema.omit("id").partial() as any) as unknown as Type<
    Pick<T, "id"> & Partial<Omit<T, "id">>
  >;
}

export const mealTypeSchema = type(
  "'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink'",
);
