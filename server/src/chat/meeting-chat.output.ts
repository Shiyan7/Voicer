import { Field, ObjectType } from '@nestjs/graphql';
import { ChatMessageOutput } from './chat-message.output';

@ObjectType()
export class MeetingChatOutput {
  @Field(() => [ChatMessageOutput])
  messages: ChatMessageOutput[];

  @Field(() => [String])
  suggestedQuestions: string[];
}
