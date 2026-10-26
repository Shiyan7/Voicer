import { Field, InputType, Int } from '@nestjs/graphql';
import { MeetingsSort } from './meetings-sort.enum';

@InputType()
export class MeetingsPageInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  limit: number = 10;

  @Field({ defaultValue: false })
  favoritesOnly: boolean = false;

  @Field(() => MeetingsSort, { defaultValue: MeetingsSort.DATE_DESC })
  sort: MeetingsSort = MeetingsSort.DATE_DESC;

  @Field(() => [String], { nullable: true })
  sources?: string[] | null;
}
