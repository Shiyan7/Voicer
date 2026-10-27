import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MeetingsStatsOutput {
  @Field(() => Int)
  weekCount: number;

  @Field(() => Int)
  weekDurationSec: number;

  @Field(() => Int)
  openActionItems: number;

  @Field(() => [String])
  sources: string[];
}
