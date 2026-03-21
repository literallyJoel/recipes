import { sql } from "bun";

export type DbRow = Record<string, unknown>;
export type DatabaseClient = Bun.SQL | Bun.TransactionSQL;

export const db = sql;

export async function queryDb<TRow extends DbRow>(
  query: string,
  values: readonly unknown[] = [],
  client: DatabaseClient = db,
): Promise<TRow[]> {
  const [strings, interpolatedValues] = toTemplateLiteral(query, values);
  return await client<TRow[]>(strings, ...interpolatedValues);
}

export async function withTransaction<TResult>(
  run: (client: Bun.TransactionSQL) => Promise<TResult>,
): Promise<TResult> {
  return await db.begin(async (transaction) => await run(transaction));
}

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

function asTemplateStringsArray(strings: string[]): TemplateStringsArray {
  return Object.assign([...strings], {
    raw: [...strings],
  }) as TemplateStringsArray;
}
