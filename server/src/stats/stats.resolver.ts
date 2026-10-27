import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { StatsDayInput, StatsInput } from './stats.input';
import { StatsDayMeetingOutput, StatsOutput } from './stats.output';
import { StatsService } from './stats.service';

@Resolver(() => StatsOutput)
export class StatsResolver {
  constructor(private readonly statsService: StatsService) {}

  @Query(() => StatsOutput)
  stats(
    @CurrentUser() user: UserEntity,
    @Args('input', { type: () => StatsInput }) input: StatsInput,
  ): Promise<StatsOutput> {
    return this.statsService.getStats(user.id, input);
  }

  @Query(() => [StatsDayMeetingOutput])
  statsDay(
    @CurrentUser() user: UserEntity,
    @Args('input', { type: () => StatsDayInput }) input: StatsDayInput,
  ): Promise<StatsDayMeetingOutput[]> {
    return this.statsService.getDayMeetings(user.id, input);
  }
}
