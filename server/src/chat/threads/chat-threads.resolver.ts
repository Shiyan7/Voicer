import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserEntity } from '../../users/user.entity';
import { ChatThreadOutput } from './chat-thread.output';
import { toChatThreadOutput } from './chat-thread.serializer';
import { ChatThreadsService } from './chat-threads.service';

@Resolver(() => ChatThreadOutput)
export class ChatThreadsResolver {
  constructor(private readonly chatThreadsService: ChatThreadsService) {}

  @Query(() => [ChatThreadOutput])
  async chatThreads(
    @CurrentUser() user: UserEntity,
  ): Promise<ChatThreadOutput[]> {
    const threads = await this.chatThreadsService.getArchiveThreads(user.id);
    return threads.map(toChatThreadOutput);
  }

  @Query(() => ChatThreadOutput)
  async meetingChatThread(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<ChatThreadOutput> {
    return toChatThreadOutput(
      await this.chatThreadsService.getMeetingThread(user.id, meetingId),
    );
  }

  @Mutation(() => ChatThreadOutput)
  async createChatThread(
    @CurrentUser() user: UserEntity,
  ): Promise<ChatThreadOutput> {
    return toChatThreadOutput(
      await this.chatThreadsService.createArchiveThread(user.id),
    );
  }

  @Mutation(() => ChatThreadOutput)
  async renameChatThread(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
    @Args('title') title: string,
  ): Promise<ChatThreadOutput> {
    return toChatThreadOutput(
      await this.chatThreadsService.rename(user.id, threadId, title),
    );
  }

  @Mutation(() => ChatThreadOutput)
  async setChatThreadPinned(
    @CurrentUser() user: UserEntity,
    @Args('threadId', { type: () => ID }) threadId: string,
    @Args('isPinned') isPinned: boolean,
  ): Promise<ChatThreadOutput> {
    return toChatThreadOutput(
      await this.chatThreadsService.setPinned(user.id, threadId, isPinned),
    );
  }
}
