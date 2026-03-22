import type { Type } from "arktype";
import { type DatabaseClient, type DbRow, queryDb } from "../client";
import {
  buildInsertClause,
  buildLimitOffsetClause,
  buildOrderByClause,
  buildSetClause,
  buildWhereClause,
  type DbScalar,
  quoteIdentifier,
  type DbColumn,
  type DeleteOptions,
  type QueryOptions,
} from "../sql";

export type BaseDaoConfig<
  TRow extends DbRow,
  TEntity,
  TCreateInput,
  TUpdateInput,
  TPrimaryKey extends DbColumn<TRow>,
> = {
  table: string;
  primaryKey: TPrimaryKey;
  rowSchema: Type<TRow>;
  defaultOrderBy?: QueryOptions<TRow>["orderBy"];
  createPrimaryKey?: () => TRow[TPrimaryKey];
  fromRow: (row: TRow) => TEntity;
  toRow?: (input: TCreateInput | TUpdateInput) => Partial<TRow>;
  toInsertRow?: (input: TCreateInput) => Partial<TRow>;
  toUpdateRow?: (input: TUpdateInput) => Partial<Omit<TRow, TPrimaryKey>>;
};

/**
 * Shared DAO foundation for table-backed persistence objects.
 * Public CRUD methods delegate to protected `_` helpers so subclasses can
 * override entrypoints like `read()` while still reusing the base mechanics.
 */
export abstract class BaseDao<
  TRow extends DbRow,
  TEntity,
  TCreateInput,
  TUpdateInput,
  TPrimaryKey extends DbColumn<TRow>,
> {
  protected constructor(
    private readonly config: BaseDaoConfig<
      TRow,
      TEntity,
      TCreateInput,
      TUpdateInput,
      TPrimaryKey
    >,
  ) {}

  async read(
    options: QueryOptions<TRow> = {},
    client?: DatabaseClient,
  ): Promise<TEntity[]> {
    return await this._read(options, client);
  }

  async create(input: TCreateInput, client?: DatabaseClient): Promise<TEntity> {
    return await this._create(input, client);
  }

  async update(
    id: TRow[TPrimaryKey],
    input: TUpdateInput,
    client?: DatabaseClient,
  ): Promise<TEntity | null> {
    return await this._update(id, input, client);
  }

  async delete(
    options: DeleteOptions<TRow>,
    client?: DatabaseClient,
  ): Promise<TEntity[]> {
    return await this._delete(options, client);
  }

  /**
   * Default table read implementation used by `read()`.
   * Subclasses can override `read()` and still call `_readFromQuery()` when
   * they need handwritten SQL but want to preserve DAO-level mapping.
   */
  protected async _read(
    options: QueryOptions<TRow> = {},
    client?: DatabaseClient,
  ): Promise<TEntity[]> {
    const whereClause = buildWhereClause(options.where);
    const limitOffsetClause = buildLimitOffsetClause(
      {
        limit: options.limit,
        offset: options.offset,
      },
      whereClause.values.length + 1,
    );
    const queryText = [
      `select * from ${quoteIdentifier(this.config.table)}`,
      whereClause.text,
      buildOrderByClause(options.orderBy ?? this.config.defaultOrderBy),
      limitOffsetClause.text,
    ]
      .filter(Boolean)
      .join(" ");

    const rows = await queryDb<TRow>(
      queryText,
      [...whereClause.values, ...limitOffsetClause.values],
      client,
    );

    return rows.map((row) => this.fromRow(row));
  }

  /**
   * Default insert implementation used by `create()`.
   * Mapper output is normalized, generated primary keys are injected when
   * configured, and the inserted row is returned via `returning *`.
   */
  protected async _create(
    input: TCreateInput,
    client?: DatabaseClient,
  ): Promise<TEntity> {
    const mappedInput = this.mapInsertInput(input);
    const withPrimaryKey = this.withPrimaryKey(mappedInput);
    const insertClause = buildInsertClause<TRow>(withPrimaryKey);

    const rows = await queryDb<TRow>(
      [
        `insert into ${quoteIdentifier(this.config.table)} (${insertClause.columnsText})`,
        `values (${insertClause.text})`,
        "returning *",
      ].join(" "),
      insertClause.values,
      client,
    );

    return this.fromRow(rows[0]);
  }

  /**
   * Default update implementation used by `update()`.
   * Undefined values are omitted from the SQL payload; if no columns remain,
   * the current row is read back instead of issuing an empty update.
   */
  protected async _update(
    id: TRow[TPrimaryKey],
    input: TUpdateInput,
    client?: DatabaseClient,
  ): Promise<TEntity | null> {
    const updateRow = this.mapUpdateInput(input);
    const setClause = buildSetClause<TRow>(updateRow as Partial<TRow>);

    if (!setClause.text) {
      const rows = await this.read(
        {
          where: {
            field: this.config.primaryKey,
            op: "=",
            value: id as Exclude<DbScalar, null>,
          },
          limit: 1,
        },
        client,
      );

      return rows[0] ?? null;
    }

    const rows = await queryDb<TRow>(
      [
        `update ${quoteIdentifier(this.config.table)}`,
        `set ${setClause.text}`,
        `where ${quoteIdentifier(this.config.primaryKey)} = $${setClause.values.length + 1}`,
        "returning *",
      ].join(" "),
      [...setClause.values, id],
      client,
    );

    const row = rows[0];
    return row ? this.fromRow(row) : null;
  }

  /**
   * Default delete implementation used by `delete()`.
   * Deleted rows are returned through the same entity mapper so callers can
   * inspect the removed records without issuing a follow-up read.
   */
  protected async _delete(
    options: DeleteOptions<TRow>,
    client?: DatabaseClient,
  ): Promise<TEntity[]> {
    const whereClause = buildWhereClause(options.where);
    const rows = await queryDb<TRow>(
      [
        `delete from ${quoteIdentifier(this.config.table)}`,
        whereClause.text,
        "returning *",
      ].join(" "),
      whereClause.values,
      client,
    );

    return rows.map((row) => this.fromRow(row));
  }

  /**
   * Execute a custom query while preserving row validation and entity mapping.
   * This is the main escape hatch for subclasses that need raw SQL control
   * without bypassing the DAO boundary.
   */
  protected async _readFromQuery<TJoinedRow extends DbRow>(
    query: string,
    values: readonly unknown[] = [],
    rowSchema: Type<TJoinedRow>,
    mapRow: (row: TJoinedRow) => TEntity,
    client?: DatabaseClient,
  ): Promise<TEntity[]> {
    const rows = await queryDb<TJoinedRow>(query, values, client);

    return rows.map((row) => {
      const validatedRow = rowSchema.assert(row) as TJoinedRow;
      return mapRow(validatedRow);
    });
  }

  protected fromRow(row: TRow): TEntity {
    const validatedRow = this.config.rowSchema.assert(row) as TRow;
    return this.config.fromRow(validatedRow);
  }

  private withPrimaryKey(valuesByColumn: Partial<TRow>): Partial<TRow> {
    const primaryKey = this.config.primaryKey;

    if (
      valuesByColumn[primaryKey] !== undefined ||
      !this.config.createPrimaryKey
    ) {
      return valuesByColumn;
    }

    return {
      ...valuesByColumn,
      [primaryKey]: this.config.createPrimaryKey(),
    };
  }

  private mapInsertInput(input: TCreateInput): Partial<TRow> {
    const mapped =
      this.config.toInsertRow?.(input) ?? this.config.toRow?.(input);

    if (!mapped) {
      throw new Error(
        `DAO for "${this.config.table}" is missing a toRow or toInsertRow mapper`,
      );
    }

    return removeUndefinedProperties(mapped);
  }

  private mapUpdateInput(
    input: TUpdateInput,
  ): Partial<Omit<TRow, TPrimaryKey>> {
    const mapped =
      this.config.toUpdateRow?.(input) ?? this.config.toRow?.(input);

    if (!mapped) {
      throw new Error(
        `DAO for "${this.config.table}" is missing a toRow or toUpdateRow mapper`,
      );
    }

    return removeUndefinedProperties(mapped) as Partial<
      Omit<TRow, TPrimaryKey>
    >;
  }
}

/**
 * Drop undefined keys before building SQL payloads.
 * `undefined` means "omit this column"; `null` is preserved so callers can
 * explicitly write SQL NULL where the schema allows it.
 */
function removeUndefinedProperties<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as T;
}
