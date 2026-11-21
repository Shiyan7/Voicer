import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChatThreadOutput {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  meetingId: string | null;

  @Field(() => String, { nullable: true })
  title: string | null;
}
