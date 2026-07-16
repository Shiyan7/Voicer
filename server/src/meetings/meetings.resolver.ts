import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { MeetingOutput } from './meeting.output';
import { MeetingsService } from './meetings.service';

@Resolver(() => MeetingOutput)
export class MeetingsResolver {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Query(() => [MeetingOutput])
  meetings(@CurrentUser() user: UserEntity): Promise<MeetingOutput[]> {
    return this.meetingsService.getUserMeetings(user.id);
  }
}
