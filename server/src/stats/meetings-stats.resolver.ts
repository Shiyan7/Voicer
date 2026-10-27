import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { MeetingsStatsOutput } from './meetings-stats.output';
import { MeetingsStatsService } from './meetings-stats.service';

@Resolver(() => MeetingsStatsOutput)
export class MeetingsStatsResolver {
  constructor(private readonly meetingsStatsService: MeetingsStatsService) {}

  @Query(() => MeetingsStatsOutput)
  meetingsStats(@CurrentUser() user: UserEntity): Promise<MeetingsStatsOutput> {
    return this.meetingsStatsService.getUserStats(user.id);
  }
}
