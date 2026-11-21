import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserEntity } from '../../users/user.entity';
import { MeetingQuestionsService } from './meeting-questions.service';

@Resolver()
export class MeetingQuestionsResolver {
  constructor(
    private readonly meetingQuestionsService: MeetingQuestionsService,
  ) {}

  @Query(() => [String])
  meetingChatSuggestions(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<string[]> {
    return this.meetingQuestionsService.getSuggestions(user.id, meetingId);
  }
}
