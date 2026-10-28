import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ChatRole } from './chat-role.enum';

registerEnumType(ChatRole, { name: 'ChatRole' });

@ObjectType()
export class ChatMessageOutput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  meetingId: string;

  @Field(() => ChatRole)
  role: ChatRole;

  @Field()
  content: string;

  @Field(() => [String])
  followUps: string[];

  @Field()
  isStreaming: boolean;

  @Field()
  isFailed: boolean;

  @Field()
  createdAt: Date;
}
