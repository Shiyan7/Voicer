import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActionItemOutput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  meetingId: string;

  @Field()
  text: string;

  @Field()
  isDone: boolean;

  @Field()
  createdAt: Date;

  @Field(() => String, { nullable: true })
  meetingTitle: string | null;
}
