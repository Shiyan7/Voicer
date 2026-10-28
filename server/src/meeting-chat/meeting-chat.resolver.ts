import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { ChatMessageOutput } from './chat-message.output';
import { MeetingChatService } from './meeting-chat.service';

@Resolver(() => ChatMessageOutput)
export class MeetingChatResolver {
  constructor(private readonly meetingChatService: MeetingChatService) {}

  @Query(() => [ChatMessageOutput])
  meetingChatMessages(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<ChatMessageOutput[]> {
    return this.meetingChatService.getMessages(user.id, meetingId);
  }

  @Query(() => [String])
  meetingChatSuggestions(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<string[]> {
    return this.meetingChatService.getSuggestions(user.id, meetingId);
  }

  @Mutation(() => ChatMessageOutput)
  meetingChatAsk(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
    @Args('question') question: string,
  ): Promise<ChatMessageOutput> {
    return this.meetingChatService.ask(user.id, meetingId, question);
  }

  @Mutation(() => Boolean)
  meetingChatClear(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<boolean> {
    return this.meetingChatService.clear(user.id, meetingId);
  }

  @Subscription(() => ChatMessageOutput, { name: 'meetingChatMessage' })
  meetingChatMessage(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<AsyncIterator<{ meetingChatMessage: ChatMessageOutput }>> {
    return this.meetingChatService.subscribe(user.id, meetingId);
  }
}
