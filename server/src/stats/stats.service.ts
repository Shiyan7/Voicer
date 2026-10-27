import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MeetingEntity } from '../meetings/meeting.entity';
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

const LOCAL_DATE = `to_char((m.startedAt AT TIME ZONE :timeZone)::date, 'YYYY-MM-DD')`;

const toDayIndex = (date: string) => Date.parse(`${date}T00:00:00Z`) / DAY_MS;

const sumBy = <T>(items: T[], pick: (item: T) => number) =>
  items.reduce((sum, item) => sum + pick(item), 0);

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
  ) {}

  async getSummary(
    userId: string,
    input: StatsSummaryInput,
  ): Promise<StatsSummaryOutput> {
    const days = await this.calendarDays(
      userId,
      input.timeZone,
    ).getRawMany<StatsCalendarDayOutput>();

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
    const [days, sources] = await Promise.all([
      this.inYear(
        this.calendarDays(userId, input.timeZone),
        input,
      ).getRawMany<StatsCalendarDayOutput>(),
      this.inYear(this.sources(userId), input).getRawMany<StatsSourceOutput>(),
    ]);

    return { days, sources };
  }

  getDayMeetings(
    userId: string,
    input: StatsDayMeetingsInput,
  ): Promise<StatsDayMeetingOutput[]> {
    return this.meetingsRepository
      .createQueryBuilder('m')
      .select(['m.id', 'm.title', 'm.source', 'm.startedAt', 'm.durationSec'])
      .where('m.userId = :userId', { userId })
      .andWhere(
        'm.startedAt >= CAST(:date AS date)::timestamp AT TIME ZONE :timeZone',
      )
      .andWhere(
        'm.startedAt < (CAST(:date AS date) + 1)::timestamp AT TIME ZONE :timeZone',
      )
      .setParameters({ date: input.date, timeZone: input.timeZone })
      .orderBy('m.startedAt', 'ASC')
      .getMany();
  }

  private calendarDays(userId: string, timeZone: string) {
    return this.meetingsRepository
      .createQueryBuilder('m')
      .select(LOCAL_DATE, 'date')
      .addSelect('COUNT(*)::int', 'count')
      .addSelect('COALESCE(SUM(m.durationSec), 0)::int', 'durationSec')
      .where('m.userId = :userId', { userId })
      .setParameter('timeZone', timeZone)
      .groupBy('date')
      .orderBy('date', 'ASC');
  }

  private sources(userId: string) {
    return this.meetingsRepository
      .createQueryBuilder('m')
      .select(`NULLIF(TRIM(m.source), '')`, 'source')
      .addSelect('COUNT(*)::int', 'count')
      .addSelect('COALESCE(SUM(m.durationSec), 0)::int', 'durationSec')
      .where('m.userId = :userId', { userId })
      .groupBy('1')
      .orderBy('"durationSec"', 'DESC')
      .addOrderBy('count', 'DESC');
  }

  private inYear<T extends SelectQueryBuilder<MeetingEntity>>(
    query: T,
    input: StatsYearInput,
  ): T {
    return query
      .andWhere(
        'm.startedAt >= make_timestamptz(:year, 1, 1, 0, 0, 0, :timeZone)',
      )
      .andWhere(
        'm.startedAt < make_timestamptz(:nextYear, 1, 1, 0, 0, 0, :timeZone)',
      )
      .setParameters({
        year: input.year,
        nextYear: input.year + 1,
        timeZone: input.timeZone,
      });
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
