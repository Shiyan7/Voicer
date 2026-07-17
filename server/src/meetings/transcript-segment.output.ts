import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TranscriptSegmentOutput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  meetingId: string;

  @Field(() => Int)
  speakerIndex: number;

  @Field(() => Int)
  startMs: number;

  @Field(() => Int)
  endMs: number;

  @Field()
  text: string;
}
