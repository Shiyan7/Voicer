import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class KeyPointOutput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  meetingId: string;

  @Field()
  text: string;

  @Field(() => Int, { nullable: true })
  atMs: number | null;

  @Field(() => Int)
  order: number;
}
