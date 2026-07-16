import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UserEntity } from '../users/user.entity';
import { MeetingOutput } from './meeting.output';
import { MeetingsService } from './meetings.service';

@Resolver(() => MeetingOutput)
export class MeetingsResolver {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Query(() => [MeetingOutput])
  @UseGuards(GqlAuthGuard)
  meetings(@CurrentUser() user: UserEntity): Promise<MeetingOutput[]> {
    return this.meetingsService.getUserMeetings(user.id);
  }
}
