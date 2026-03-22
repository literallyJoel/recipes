import { type } from "arktype";
import type { SharedRecipe } from "@jvrecipes/validation";
import type { DatabaseClient } from "../client";
import {
  recipeDBRowSchema,
  sharedRecipeDbRowSchema,
  type SharedRecipeDbRow,
} from "../schemas";
import { BaseDao } from "./BaseDao";

export type SharedRecipeRecord = Omit<SharedRecipe, "ingredients">;

const sharedRecipeWithUsersDbRowSchema = recipeDBRowSchema.and({
  sharedRowId: "string.uuid",
  sharedById: "string",
  sharedWithId: "string",
  sharedCanEdit: "boolean",
  sharedCreatedAt: "string",
  userName: "string",
  userImage: "string | null",
  sharedByName: "string",
  sharedByImage: "string | null",
});

type SharedRecipeWithUsersDbRow = typeof sharedRecipeWithUsersDbRowSchema.infer;

export class SharedRecipeDao extends BaseDao<
  SharedRecipeDbRow,
  SharedRecipeRecord,
  never,
  never,
  "id"
> {
  constructor() {
    super({
      table: "shared_recipes",
      primaryKey: "id",
      rowSchema: sharedRecipeDbRowSchema,
      fromRow: () => {
        throw new Error("SharedRecipeDao only supports joined shared recipe reads");
      },
      toInsertRow: () => {
        throw new Error("SharedRecipeDao does not support create");
      },
      toUpdateRow: () => {
        throw new Error("SharedRecipeDao does not support update");
      },
    });
  }

  async readSharedWithUsers(
    sharedWithId: string,
    options: {
      recipeId?: string;
      limit?: number;
    } = {},
    client?: DatabaseClient,
  ): Promise<SharedRecipeRecord[]> {
    const values: unknown[] = [sharedWithId];
    const conditions = [
      `sr."sharedWithId" = $1`,
      `r."deletedAt" is null`,
    ];

    if (options.recipeId) {
      values.push(options.recipeId);
      conditions.push(`r."id" = $${values.length}`);
    }

    const limitClause = buildLimitClause(options.limit, values);
    return await this._readFromQuery(
      [
        `select`,
        `r.*,`,
        `sr."id" as "sharedRowId",`,
        `sr."sharedById",`,
        `sr."sharedWithId",`,
        `sr."canEdit" as "sharedCanEdit",`,
        `sr."createdAt" as "sharedCreatedAt",`,
        `owner_user."name" as "userName",`,
        `owner_user."image" as "userImage",`,
        `shared_by_user."name" as "sharedByName",`,
        `shared_by_user."image" as "sharedByImage"`,
        `from "shared_recipes" sr`,
        `inner join "recipes" r on r."id" = sr."recipeId"`,
        `inner join "user" owner_user on owner_user."id" = r."userId"`,
        `inner join "user" shared_by_user on shared_by_user."id" = sr."sharedById"`,
        `where ${conditions.join(" and ")}`,
        `order by r."updatedAt" desc`,
        limitClause,
      ]
        .filter(Boolean)
        .join(" "),
      values,
      sharedRecipeWithUsersDbRowSchema,
      (row) => this.fromJoinedRow(row),
      client,
    );
  }

  private fromJoinedRow(row: SharedRecipeWithUsersDbRow): SharedRecipeRecord {
    const validatedRow = sharedRecipeWithUsersDbRowSchema.assert(row) as SharedRecipeWithUsersDbRow;

    return {
      id: validatedRow.id,
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
      sharedByUser: {
        id: validatedRow.sharedById,
        name: validatedRow.sharedByName,
        image: validatedRow.sharedByImage ?? undefined,
      },
    };
  }
}

export const sharedRecipeDao = new SharedRecipeDao();

function buildLimitClause(limit: number | undefined, values: unknown[]): string {
  if (typeof limit !== "number") {
    return "";
  }

  values.push(limit);
  return `limit $${values.length}`;
}
