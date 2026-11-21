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

@Resolver(() => ChatMessageOutput)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [ChatMessageOutput])
  chatMessages(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
  ): Promise<ChatMessageOutput[]> {
    return this.chatService.getMessages(user.id, threadId);
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

  @Subscription(() => ChatMessageOutput, { name: 'chatMessage' })
  chatMessage(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
  ): Promise<AsyncIterator<{ chatMessage: ChatMessageOutput }>> {
    return this.chatService.subscribe(user.id, threadId);
  }
}
