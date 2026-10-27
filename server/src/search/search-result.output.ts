import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { SearchMatchKind } from './search-match-kind.enum';

@ObjectType()
export class SearchResultOutput {
  @Field(() => ID)
  meetingId: string;

  @Field(() => ID)
  matchId: string;

  @Field(() => String, { nullable: true })
  title: string | null;

  @Field(() => String, { nullable: true })
  source: string | null;

  @Field()
  startedAt: Date;

  @Field(() => Int, { nullable: true })
  durationSec: number | null;

  @Field(() => SearchMatchKind)
  kind: SearchMatchKind;

  @Field()
  text: string;

  @Field(() => Int, { nullable: true })
  atMs: number | null;

  @Field(() => Int)
  matchCount: number;
}
