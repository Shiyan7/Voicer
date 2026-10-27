import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  StatsDayMeetingsInput,
  StatsSummaryInput,
  StatsYearInput,
} from './stats.input';
import {
  StatsCalendarDayOutput,
  StatsDayMeetingOutput,
  StatsSourceOutput,
  StatsSummaryOutput,
  StatsYearOutput,
} from './stats.output';

const DAY_MS = 24 * 60 * 60 * 1000;

const CALENDAR_DAYS_SQL = (where: string) => `
  SELECT
    to_char((m."startedAt" AT TIME ZONE $2)::date, 'YYYY-MM-DD') AS date,
    COUNT(*)::int AS count,
    COALESCE(SUM(m."durationSec"), 0)::int AS "durationSec"
  FROM meetings m WHERE m."userId" = $1 ${where}
  GROUP BY 1 ORDER BY 1
`;

const IN_YEAR = `
  AND m."startedAt" >= make_timestamptz($3, 1, 1, 0, 0, 0, $2)
  AND m."startedAt" < make_timestamptz($3 + 1, 1, 1, 0, 0, 0, $2)
`;

const SOURCES_SQL = `
  SELECT
    NULLIF(TRIM(m.source), '') AS source,
    COUNT(*)::int AS count,
    COALESCE(SUM(m."durationSec"), 0)::int AS "durationSec"
  FROM meetings m WHERE m."userId" = $1 ${IN_YEAR}
  GROUP BY 1 ORDER BY "durationSec" DESC, count DESC
`;

const DAY_MEETINGS_SQL = `
  SELECT m.id, m.title, m.source, m."startedAt", m."durationSec"
  FROM meetings m
  WHERE m."userId" = $1
    AND m."startedAt" >= ($3::date)::timestamp AT TIME ZONE $2
    AND m."startedAt" < ($3::date + 1)::timestamp AT TIME ZONE $2
  ORDER BY m."startedAt"
`;

const toDayIndex = (date: string) => Date.parse(`${date}T00:00:00Z`) / DAY_MS;

const sumBy = <T>(items: T[], pick: (item: T) => number) =>
  items.reduce((sum, item) => sum + pick(item), 0);

@Injectable()
export class StatsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getSummary(
    userId: string,
    input: StatsSummaryInput,
  ): Promise<StatsSummaryOutput> {
    const days = await this.query<StatsCalendarDayOutput>(
      CALENDAR_DAYS_SQL(''),
      [userId, input.timeZone],
    );

    return {
      years: [...new Set(days.map((day) => Number(day.date.slice(0, 4))))].sort(
        (a, b) => b - a,
      ),
      count: sumBy(days, (day) => day.count),
      durationSec: sumBy(days, (day) => day.durationSec),
      activeDays: days.length,
      longestStreak: this.getLongestStreak(days.map((day) => day.date)),
    };
  }

  async getYear(
    userId: string,
    input: StatsYearInput,
  ): Promise<StatsYearOutput> {
    const params = [userId, input.timeZone, input.year];

    const [days, sources] = await Promise.all([
      this.query<StatsCalendarDayOutput>(CALENDAR_DAYS_SQL(IN_YEAR), params),
      this.query<StatsSourceOutput>(SOURCES_SQL, params),
    ]);

    return { days, sources };
  }

  getDayMeetings(
    userId: string,
    input: StatsDayMeetingsInput,
  ): Promise<StatsDayMeetingOutput[]> {
    return this.query<StatsDayMeetingOutput>(DAY_MEETINGS_SQL, [
      userId,
      input.timeZone,
      input.date,
    ]);
  }

  private query<T>(sql: string, params: unknown[]): Promise<T[]> {
    return this.dataSource.query<T[]>(sql, params);
  }

  private getLongestStreak(dates: string[]): number {
    const indexes = dates.map(toDayIndex);
    let longest = 0;
    let current = 0;
    indexes.forEach((day, index) => {
      current = day - indexes[index - 1] === 1 ? current + 1 : 1;
      longest = Math.max(longest, current);
    });
    return longest;
  }
}
