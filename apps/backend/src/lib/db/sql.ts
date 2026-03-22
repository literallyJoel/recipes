import type { DbRow } from "./client";

export type DbColumn<TRow extends DbRow> = Extract<keyof TRow, string>;
export type DbScalar = string | number | boolean | Date | null;

export type FilterCondition<TRow extends DbRow> =
  | {
      field: DbColumn<TRow>;
      op?: "=" | "!=" | ">" | ">=" | "<" | "<=" | "like" | "ilike";
      value: Exclude<DbScalar, null>;
    }
  | {
      field: DbColumn<TRow>;
      op: "in" | "not in";
      value: readonly Exclude<DbScalar, null>[];
    }
  | {
      field: DbColumn<TRow>;
      op: "is null" | "is not null";
    };

export type FilterGroup<TRow extends DbRow> =
  | { and: readonly FilterNode<TRow>[] }
  | { or: readonly FilterNode<TRow>[] };

export type FilterNode<TRow extends DbRow> =
  | FilterCondition<TRow>
  | FilterGroup<TRow>;

export type OrderBy<TRow extends DbRow> = {
  field: DbColumn<TRow>;
  direction?: "asc" | "desc";
};

export type QueryOptions<TRow extends DbRow> = {
  where?: FilterNode<TRow>;
  orderBy?: readonly OrderBy<TRow>[];
  limit?: number;
  offset?: number;
};

export type DeleteOptions<TRow extends DbRow> = {
  where: FilterNode<TRow>;
};

export type SqlFragment = {
  text: string;
  values: unknown[];
};

export function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

export function buildWhereClause<TRow extends DbRow>(
  where?: FilterNode<TRow>,
  startIndex = 1,
): SqlFragment {
  if (!where) {
    return { text: "", values: [] };
  }

  const built = buildFilterNode(where, startIndex);

  return {
    text: `where ${built.text}`,
    values: built.values,
  };
}

export function buildOrderByClause<TRow extends DbRow>(
  orderBy?: readonly OrderBy<TRow>[],
): string {
  if (!orderBy || orderBy.length === 0) {
    return "";
  }

  return `order by ${orderBy
    .map(
      ({ field, direction = "asc" }) =>
        `${quoteIdentifier(field)} ${direction}`,
    )
    .join(", ")}`;
}

export function buildLimitOffsetClause(
  { limit, offset }: Pick<QueryOptions<DbRow>, "limit" | "offset">,
  startIndex = 1,
): SqlFragment {
  const values: unknown[] = [];
  const segments: string[] = [];

  if (typeof limit === "number") {
    values.push(limit);
    segments.push(`limit $${startIndex + values.length - 1}`);
  }

  if (typeof offset === "number") {
    values.push(offset);
    segments.push(`offset $${startIndex + values.length - 1}`);
  }

  return {
    text: segments.join(" "),
    values,
  };
}

export function buildSetClause<TRow extends DbRow>(
  valuesByColumn: Partial<TRow>,
  startIndex = 1,
): SqlFragment {
  const values: unknown[] = [];
  const assignments: string[] = [];

  for (const [column, value] of Object.entries(valuesByColumn)) {
    if (value === undefined) {
      continue;
    }

    values.push(value);
    assignments.push(
      `${quoteIdentifier(column)} = $${startIndex + values.length - 1}`,
    );
  }

  return {
    text: assignments.join(", "),
    values,
  };
}

export function buildInsertClause<TRow extends DbRow>(
  valuesByColumn: Partial<TRow>,
  startIndex = 1,
): SqlFragment & { columnsText: string } {
  const columns: string[] = [];
  const values: unknown[] = [];
  const placeholders: string[] = [];

  for (const [column, value] of Object.entries(valuesByColumn)) {
    if (value === undefined) {
      continue;
    }

    columns.push(quoteIdentifier(column));
    values.push(value);
    placeholders.push(`$${startIndex + values.length - 1}`);
  }

  return {
    columnsText: columns.join(", "),
    text: placeholders.join(", "),
    values,
  };
}

function buildFilterNode<TRow extends DbRow>(
  node: FilterNode<TRow>,
  startIndex: number,
): SqlFragment {
  if ("and" in node || "or" in node) {
    const operator = "and" in node ? "and" : "or";
    const children = "and" in node ? node.and : node.or;

    if (children.length === 0) {
      return {
        text: "",
        values: [],
      };
    }

    const parts: string[] = [];
    const values: unknown[] = [];
    let nextIndex = startIndex;

    for (const child of children) {
      const built = buildFilterNode(child, nextIndex);
      parts.push(`(${built.text})`);
      values.push(...built.values);
      nextIndex += built.values.length;
    }

    return {
      text: parts.join(` ${operator} `),
      values,
    };
  }

  const column = quoteIdentifier(node.field);

  if (node.op === "is null" || node.op === "is not null") {
    return {
      text: `${column} ${node.op}`,
      values: [],
    };
  }

  if (node.op === "in" || node.op === "not in") {
    if (node.value.length === 0) {
      return {
        text: node.op === "in" ? "1 = 0" : "1 = 1",
        values: [],
      };
    }

    const values = [...node.value];
    const placeholders = values
      .map((_, index) => `$${startIndex + index}`)
      .join(", ");

    return {
      text: `${column} ${node.op} (${placeholders})`,
      values,
    };
  }

  const comparisonValue = "value" in node ? node.value : undefined;

  return {
    text: `${column} ${node.op ?? "="} $${startIndex}`,
    values: [comparisonValue],
  };
}
