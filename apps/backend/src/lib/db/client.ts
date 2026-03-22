import { sql } from "bun";
import { DatabaseError } from "../errors";

/**
 * Generic row shape used by the lightweight SQL helpers.
 */
export type DbRow = Record<string, unknown>;

/**
 * Database client surface shared by pooled and transaction-scoped Bun SQL
 * instances.
 */
export type DatabaseClient = Bun.SQL | Bun.TransactionSQL;

/**
 * Shared Bun SQL client for the backend database layer.
 */
export const db = sql;

/**
 * Execute a positional-parameter SQL query through Bun's interpolation path.
 * Queries are authored with `$1`, `$2`, ... placeholders and converted into a
 * tagged-template call so Bun handles value binding.
 */
export async function queryDb<TRow extends DbRow>(
  query: string,
  values: readonly unknown[] = [],
  client: DatabaseClient = db,
): Promise<TRow[]> {
  const [strings, interpolatedValues] = toTemplateLiteral(query, values);

  try {
    return await client<TRow[]>(strings, ...interpolatedValues);
  } catch (error) {
    throw new DatabaseError("Database query failed", {
      cause: error,
      data: {
        query,
        parameterCount: values.length,
      },
    });
  }
}

/**
 * Run a function inside a Bun SQL transaction.
 */
export async function withTransaction<TResult>(
  run: (client: Bun.TransactionSQL) => Promise<TResult>,
): Promise<TResult> {
  try {
    return await db.begin(async (transaction) => await run(transaction));
  } catch (error) {
    throw new DatabaseError("Database transaction failed", {
      cause: error,
    });
  }
}

/**
 * Convert a `$1`-style SQL string into a `TemplateStringsArray` plus values so
 * the query can be executed through Bun's safe interpolation API.
 */
function toTemplateLiteral(
  query: string,
  values: readonly unknown[],
): [TemplateStringsArray, unknown[]] {
  const strings: string[] = [];
  const interpolatedValues: unknown[] = [];
  const placeholderPattern = /\$(\d+)/g;
  let lastIndex = 0;

  for (const match of query.matchAll(placeholderPattern)) {
    const placeholder = match[0];
    const valueIndex = Number(match[1]) - 1;
    const matchIndex = match.index ?? 0;

    strings.push(query.slice(lastIndex, matchIndex));
    interpolatedValues.push(values[valueIndex]);
    lastIndex = matchIndex + placeholder.length;
  }

  strings.push(query.slice(lastIndex));

  return [asTemplateStringsArray(strings), interpolatedValues];
}

/**
 * Build a minimal `TemplateStringsArray` object for programmatic tagged-template
 * execution.
 */
function asTemplateStringsArray(strings: string[]): TemplateStringsArray {
  return Object.assign([...strings], {
    raw: [...strings],
  }) as TemplateStringsArray;
}
