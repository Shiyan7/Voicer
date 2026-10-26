import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionItemEntity } from '../actions/action-item.entity';
import { MeetingEntity } from '../meetings/meeting.entity';
import { MeetingsStatsOutput } from './meetings-stats.output';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class MeetingsStatsService {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    @InjectRepository(ActionItemEntity)
    private readonly actionItemsRepository: Repository<ActionItemEntity>,
  ) {}

  async getUserStats(userId: string): Promise<MeetingsStatsOutput> {
    const [week, openActionItems, sources] = await Promise.all([
      this.getWeekTotals(userId),
      this.actionItemsRepository.count({ where: { userId, isDone: false } }),
      this.getSources(userId),
    ]);

    return {
      weekCount: week?.count ?? 0,
      weekDurationSec: week?.duration ?? 0,
      openActionItems,
      sources,
    };
  }

  private getWeekTotals(userId: string) {
    const weekAgo = new Date(Date.now() - WEEK_MS);

    return this.meetingsRepository
      .createQueryBuilder('m')
      .select('COUNT(*)::int', 'count')
      .addSelect('COALESCE(SUM(m.durationSec), 0)::int', 'duration')
      .where('m.userId = :userId', { userId })
      .andWhere('m.startedAt >= :weekAgo', { weekAgo })
      .getRawOne<{ count: number; duration: number }>();
  }

  private async getSources(userId: string): Promise<string[]> {
    const rows = await this.meetingsRepository
      .createQueryBuilder('m')
      .select('DISTINCT m.source', 'source')
      .where('m.userId = :userId', { userId })
      .andWhere('m.source IS NOT NULL')
      .getRawMany<{ source: string }>();

    return rows.map((row) => row.source).sort();
  }
}
