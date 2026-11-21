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
import { ChatService } from './chat.service';
import { MeetingQuestionsService } from './meeting/meeting-questions.service';

@Resolver(() => ChatMessageOutput)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly meetingQuestionsService: MeetingQuestionsService,
  ) {}

  @Query(() => [ChatMessageOutput])
  chatMessages(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
  ): Promise<ChatMessageOutput[]> {
    return this.chatService.getMessages(user.id, threadId);
  }

  @Query(() => [String])
  meetingChatSuggestions(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<string[]> {
    return this.meetingQuestionsService.getSuggestions(user.id, meetingId);
  }

  @Mutation(() => ChatMessageOutput)
  chatAsk(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
    @Args('question') question: string,
  ): Promise<ChatMessageOutput> {
    return this.chatService.ask(user.id, threadId, question);
  }

  @Mutation(() => Boolean)
  chatClear(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
  ): Promise<boolean> {
    return this.chatService.clear(user.id, threadId);
  }

  @Mutation(() => Boolean)
  deleteChatThread(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
  ): Promise<boolean> {
    return this.chatService.deleteThread(user.id, threadId);
  }

  @Subscription(() => ChatMessageOutput, { name: 'chatMessage' })
  chatMessage(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
  ): Promise<AsyncIterator<{ chatMessage: ChatMessageOutput }>> {
    return this.chatService.subscribe(user.id, threadId);
  }
}
