import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StatsDayInput, StatsInput } from './stats.input';
import {
  StatsDayMeetingOutput,
  StatsDayOutput,
  StatsOutput,
  StatsSourceOutput,
} from './stats.output';

const DAY_MS = 24 * 60 * 60 * 1000;

const LOCAL_TS = `(m."startedAt" AT TIME ZONE $2)`;

const YEARS_SQL = `
  SELECT DISTINCT EXTRACT(YEAR FROM ${LOCAL_TS})::int AS year
  FROM meetings m WHERE m."userId" = $1
  ORDER BY year DESC
`;

const ALL_DAYS_SQL = `
  SELECT
    to_char(${LOCAL_TS}::date, 'YYYY-MM-DD') AS date,
    COUNT(*)::int AS count,
    COALESCE(SUM(m."durationSec"), 0)::int AS "durationSec"
  FROM meetings m WHERE m."userId" = $1
  GROUP BY 1 ORDER BY 1
`;

const IN_YEAR = `m."userId" = $1 AND EXTRACT(YEAR FROM ${LOCAL_TS}) = $3::int`;

const DAYS_SQL = `
  SELECT
    to_char(${LOCAL_TS}::date, 'YYYY-MM-DD') AS date,
    COUNT(*)::int AS count,
    COALESCE(SUM(m."durationSec"), 0)::int AS "durationSec"
  FROM meetings m WHERE ${IN_YEAR}
  GROUP BY 1 ORDER BY 1
`;

const SOURCES_SQL = `
  SELECT
    NULLIF(TRIM(m.source), '') AS source,
    COUNT(*)::int AS count,
    COALESCE(SUM(m."durationSec"), 0)::int AS "durationSec"
  FROM meetings m WHERE ${IN_YEAR}
  GROUP BY 1 ORDER BY "durationSec" DESC, count DESC
`;

const DAY_MEETINGS_SQL = `
  SELECT m.id, m.title, m.source, m."startedAt", m."durationSec"
  FROM meetings m
  WHERE m."userId" = $1 AND ${LOCAL_TS}::date = $3::date
  ORDER BY m."startedAt"
`;

const toDayIndex = (date: string) => Date.parse(`${date}T00:00:00Z`) / DAY_MS;

@Injectable()
export class StatsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getStats(userId: string, input: StatsInput): Promise<StatsOutput> {
    await this.assertTimeZone(input.timeZone);

    const tz = [userId, input.timeZone];
    const inYear = [...tz, input.year];

    const [years, allDays, days, sources] = await Promise.all([
      this.query<{ year: number }>(YEARS_SQL, tz),
      this.query<StatsDayOutput>(ALL_DAYS_SQL, tz),
      this.query<StatsDayOutput>(DAYS_SQL, inYear),
      this.query<StatsSourceOutput>(SOURCES_SQL, inYear),
    ]);

    return {
      years: years.map((row) => row.year),
      days,
      summary: {
        count: allDays.reduce((sum, day) => sum + day.count, 0),
        durationSec: allDays.reduce((sum, day) => sum + day.durationSec, 0),
        activeDays: allDays.length,
        longestStreak: this.getLongestStreak(
          allDays.map((day) => toDayIndex(day.date)),
        ),
      },
      sources,
    };
  }

  async getDayMeetings(
    userId: string,
    input: StatsDayInput,
  ): Promise<StatsDayMeetingOutput[]> {
    await this.assertTimeZone(input.timeZone);

    return this.query<StatsDayMeetingOutput>(DAY_MEETINGS_SQL, [
      userId,
      input.timeZone,
      input.date,
    ]);
  }

  private query<T>(sql: string, params: unknown[]): Promise<T[]> {
    return this.dataSource.query<T[]>(sql, params);
  }

  private async assertTimeZone(timeZone: string): Promise<void> {
    const [row] = await this.query<{ exists: boolean }>(
      'SELECT EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = $1)',
      [timeZone],
    );
    if (!row.exists) throw new BadRequestException('Unknown time zone');
  }

  private getLongestStreak(dayIndexes: number[]): number {
    let longest = 0;
    let current = 0;
    dayIndexes.forEach((day, index) => {
      current = day - dayIndexes[index - 1] === 1 ? current + 1 : 1;
      longest = Math.max(longest, current);
    });
    return longest;
  }
}
