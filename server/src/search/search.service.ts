import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SearchMatchKind } from './search-match-kind.enum';
import { SearchResultOutput } from './search-result.output';
import { SearchSort } from './search-sort.enum';
import { SearchInput } from './search.input';

const MAX_LIMIT = 50;
const MIN_WORD_LENGTH = 2;

interface SearchRow {
  meetingId: string;
  matchId: string;
  source: string | null;
  startedAt: Date;
  durationSec: number | null;
  kind: SearchMatchKind;
  text: string;
  atMs: number | null;
  matchCount: number;
}

const SEARCH_SQL = (orderBy: string) => `
  WITH hits AS (
    SELECT s."meetingId", s.id AS "matchId", '${SearchMatchKind.TRANSCRIPT}' AS kind, s.text, s."startMs" AS "atMs"
    FROM transcript_segments s
    JOIN meetings m ON m.id = s."meetingId"
    WHERE m."userId" = $1 AND s.text ILIKE ALL($2)
    UNION ALL
    SELECT k."meetingId", k.id, '${SearchMatchKind.KEY_POINT}', k.text, k."atMs"
    FROM key_points k
    JOIN meetings m ON m.id = k."meetingId"
    WHERE m."userId" = $1 AND k.text ILIKE ALL($2)
    UNION ALL
    SELECT a."meetingId", a.id, '${SearchMatchKind.ACTION_ITEM}', a.text, a."atMs"
    FROM action_items a
    WHERE a."userId" = $1 AND a.text ILIKE ALL($2)
    UNION ALL
    SELECT m.id, m.id, '${SearchMatchKind.SOURCE}', m.source, NULL
    FROM meetings m
    WHERE m."userId" = $1 AND m.source ILIKE ALL($2)
  ),
  ranked AS (
    SELECT
      h.*,
      COUNT(*) OVER (PARTITION BY h."meetingId")::int AS "matchCount",
      ROW_NUMBER() OVER (
        PARTITION BY h."meetingId"
        ORDER BY
          CASE h.kind
            WHEN '${SearchMatchKind.KEY_POINT}' THEN 0
            WHEN '${SearchMatchKind.ACTION_ITEM}' THEN 1
            WHEN '${SearchMatchKind.TRANSCRIPT}' THEN 2
            ELSE 3
          END,
          h."atMs" NULLS LAST
      ) AS rank
    FROM hits h
  )
  SELECT
    r."meetingId", r."matchId", r.kind, r.text, r."atMs", r."matchCount",
    m.source, m."startedAt", m."durationSec"
  FROM ranked r
  JOIN meetings m ON m.id = r."meetingId"
  WHERE r.rank = 1
  ORDER BY ${orderBy}
  LIMIT $3
`;

const ORDER_BY: Record<SearchSort, string> = {
  [SearchSort.RELEVANCE]: 'r."matchCount" DESC, m."startedAt" DESC',
  [SearchSort.RECENT]: 'm."startedAt" DESC',
};

@Injectable()
export class SearchService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async search(
    userId: string,
    input: SearchInput,
  ): Promise<SearchResultOutput[]> {
    const patterns = this.toPatterns(input.query);
    if (!patterns.length) return [];

    const limit = Math.min(Math.max(1, input.limit), MAX_LIMIT);

    return this.dataSource.query<SearchRow[]>(
      SEARCH_SQL(ORDER_BY[input.sort]),
      [userId, patterns, limit],
    );
  }

  private toPatterns(query: string): string[] {
    return query
      .trim()
      .split(/\s+/)
      .filter((word) => word.length >= MIN_WORD_LENGTH)
      .map((word) => `%${word.replace(/[\\%_]/g, '\\$&')}%`);
  }
}
