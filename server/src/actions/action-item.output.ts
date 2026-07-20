import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

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

  @Field(() => Int, { nullable: true })
  speakerIndex: number | null;

  @Field(() => Int, { nullable: true })
  atMs: number | null;

  @Field(() => Date, { nullable: true })
  dueDate: Date | null;

  @Field()
  createdAt: Date;

  @Field(() => String, { nullable: true })
  meetingSource: string | null;

  @Field(() => Date)
  meetingStartedAt: Date;
}
