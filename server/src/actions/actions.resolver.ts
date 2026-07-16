import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { ActionItemOutput } from './action-item.output';
import { ActionsService } from './actions.service';

@Resolver(() => ActionItemOutput)
export class ActionsResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Query(() => [ActionItemOutput])
  actionItems(@CurrentUser() user: UserEntity): Promise<ActionItemOutput[]> {
    return this.actionsService.getUserActionItems(user.id);
  }

  @Query(() => [ActionItemOutput])
  meetingActionItems(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<ActionItemOutput[]> {
    return this.actionsService.getMeetingActionItems(user.id, meetingId);
  }
}
