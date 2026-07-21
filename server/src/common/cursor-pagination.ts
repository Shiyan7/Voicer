import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface CursorColumn<Entity extends ObjectLiteral> {
  expression: string;
  key: string;
  toCursorValue: (entity: Entity) => string;
}

export interface CursorPage<Entity> {
  items: Entity[];
  meta: { nextCursor: string | null; hasNextItems: boolean };
}

export async function paginateByCursor<Entity extends ObjectLiteral>(
  query: SelectQueryBuilder<Entity>,
  columns: CursorColumn<Entity>[],
  input: { afterCursor?: string | null; limit: number },
): Promise<CursorPage<Entity>> {
  const cursor = decodeCursor(input.afterCursor);

  columns.forEach((column) => query.addOrderBy(column.expression, 'DESC'));

  if (cursor) {
    applyKeysetWhere(query, columns, cursor);
  }

  const rows = await query.take(input.limit + 1).getMany();
  const hasNextItems = rows.length > input.limit;
  const items = hasNextItems ? rows.slice(0, input.limit) : rows;
  const lastItem = items.at(-1);

  return {
    items,
    meta: {
      nextCursor:
        hasNextItems && lastItem ? encodeCursor(lastItem, columns) : null,
      hasNextItems,
    },
  };
}

function applyKeysetWhere<Entity extends ObjectLiteral>(
  query: SelectQueryBuilder<Entity>,
  columns: CursorColumn<Entity>[],
  cursor: Record<string, string>,
): void {
  const clauses = columns.map((column, index) => {
    const equalities = columns
      .slice(0, index)
      .map((previous) => `${previous.expression} = :cursor_${previous.key}`);

    return `(${[...equalities, `${column.expression} < :cursor_${column.key}`].join(' AND ')})`;
  });

  const params = Object.fromEntries(
    columns.map((column) => [`cursor_${column.key}`, cursor[column.key]]),
  );

  query.andWhere(`(${clauses.join(' OR ')})`, params);
}

function encodeCursor<Entity extends ObjectLiteral>(
  entity: Entity,
  columns: CursorColumn<Entity>[],
): string {
  const payload = Object.fromEntries(
    columns.map((column) => [column.key, column.toCursorValue(entity)]),
  );

  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
}

function decodeCursor(cursor?: string | null): Record<string, string> | null {
  if (!cursor) return null;

  return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8')) as Record<
    string,
    string
  >;
}
