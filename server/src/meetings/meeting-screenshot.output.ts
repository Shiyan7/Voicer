import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MeetingScreenshotOutput {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  offsetMs: number;

  @Field()
  url: string;

  @Field()
  thumbUrl: string;
}
