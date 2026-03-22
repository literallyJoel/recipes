import type { CreateRecipe, Recipe, UpdateRecipe } from "@jvrecipes/validation";
import type { DatabaseClient } from "../client";
import type { RecipeDbRow } from "../schemas";
import { recipeDBRowSchema } from "../schemas";
import { BaseDao } from "./BaseDao";
import {
  buildLimitOffsetClause,
  buildOrderByClause,
  buildWhereClause,
  type QueryOptions,
} from "../sql";

export type RecipeRecord = Omit<Recipe, "ingredients"> & {
  userId: string;
};

export type CreateRecipeRecord = CreateRecipe & {
  userId: string;
};

export type UpdateRecipeRecord = UpdateRecipe;

const recipeWithUserDbRowSchema = recipeDBRowSchema.and({
  userName: "string",
  userImage: "string | null",
});

type RecipeWithUserDbRow = typeof recipeWithUserDbRowSchema.infer;

export class RecipeDao extends BaseDao<
  RecipeDbRow,
  RecipeRecord,
  CreateRecipeRecord,
  UpdateRecipeRecord,
  "id"
> {
  constructor() {
    super({
      table: "recipes",
      primaryKey: "id",
      rowSchema: recipeDBRowSchema,
      defaultOrderBy: [{ field: "updatedAt", direction: "desc" }],
      createPrimaryKey: () => crypto.randomUUID(),
      fromRow: (row) => ({
        id: row.id,
        userId: row.userId,
        title: row.title,
        description: row.description ?? undefined,
        instructions: row.instructions ?? undefined,
        servings: row.servings ?? 1,
        prepMins: row.prepMins ?? undefined,
        cookMins: row.cookMins ?? undefined,
        isPublic: row.isPublic,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        user: {
          id: row.userId,
        },
      }),
      toRow: (input) => ({
        userId: "userId" in input ? input.userId : undefined,
        title: input.title,
        description: input.description,
        instructions: input.instructions,
        servings: input.servings,
        prepMins: input.prepMins,
        cookMins: input.cookMins,
        isPublic: input.isPublic,
      }),
    });
  }

  override async read(
    options: QueryOptions<RecipeDbRow> = {},
    client?: DatabaseClient,
  ): Promise<RecipeRecord[]> {
    const whereClause = buildWhereClause(options.where);
    const limitOffsetClause = buildLimitOffsetClause(
      {
        limit: options.limit,
        offset: options.offset,
      },
      whereClause.values.length + 1,
    );

    return await this._readFromQuery(
      [
        `select r.*, u."name" as "userName", u."image" as "userImage"`,
        `from "recipes" r`,
        `inner join "user" u on u."id" = r."userId"`,
        prefixTableAlias(whereClause.text, "r"),
        prefixTableAlias(
          buildOrderByClause(
            options.orderBy ?? [{ field: "updatedAt", direction: "desc" }],
          ),
          "r",
        ),
        limitOffsetClause.text,
      ]
        .filter(Boolean)
        .join(" "),
      [...whereClause.values, ...limitOffsetClause.values],
      recipeWithUserDbRowSchema,
      (row) => this.fromJoinedRow(row),
      client,
    );
  }

  private fromJoinedRow(row: RecipeWithUserDbRow): RecipeRecord {
    const validatedRow = recipeWithUserDbRowSchema.assert(
      row,
    ) as RecipeWithUserDbRow;

    return {
      id: validatedRow.id,
      userId: validatedRow.userId,
      title: validatedRow.title,
      description: validatedRow.description ?? undefined,
      instructions: validatedRow.instructions ?? undefined,
      servings: validatedRow.servings ?? 1,
      prepMins: validatedRow.prepMins ?? undefined,
      cookMins: validatedRow.cookMins ?? undefined,
      isPublic: validatedRow.isPublic,
      createdAt: new Date(validatedRow.createdAt),
      updatedAt: new Date(validatedRow.updatedAt),
      user: {
        id: validatedRow.userId,
        name: validatedRow.userName,
        image: validatedRow.userImage ?? undefined,
      },
    };
  }
}

export const recipeDao = new RecipeDao();

function prefixTableAlias(clause: string, tableAlias: string): string {
  return clause.replace(/"([^"]+)"/g, `${tableAlias}."$1"`);
}
