import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import {
  StatsDayMeetingsInput,
  StatsSummaryInput,
  StatsYearInput,
} from './stats.input';
import {
  StatsDayMeetingOutput,
  StatsSummaryOutput,
  StatsYearOutput,
} from './stats.output';
import { StatsService } from './stats.service';

@Resolver()
export class StatsResolver {
  constructor(private readonly statsService: StatsService) {}

  @Query(() => StatsSummaryOutput)
  statsSummary(
    @CurrentUser() user: UserEntity,
    @Args('input', { type: () => StatsSummaryInput }) input: StatsSummaryInput,
  ): Promise<StatsSummaryOutput> {
    return this.statsService.getSummary(user.id, input);
  }

  @Query(() => StatsYearOutput)
  statsYear(
    @CurrentUser() user: UserEntity,
    @Args('input', { type: () => StatsYearInput }) input: StatsYearInput,
  ): Promise<StatsYearOutput> {
    return this.statsService.getYear(user.id, input);
  }

  @Query(() => [StatsDayMeetingOutput])
  statsDayMeetings(
    @CurrentUser() user: UserEntity,
    @Args('input', { type: () => StatsDayMeetingsInput })
    input: StatsDayMeetingsInput,
  ): Promise<StatsDayMeetingOutput[]> {
    return this.statsService.getDayMeetings(user.id, input);
  }
}
