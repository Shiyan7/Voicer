import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchSort } from './search-sort.enum';

@InputType()
export class SearchInput {
  @Field()
  query: string;

  @Field(() => SearchSort, { defaultValue: SearchSort.RELEVANCE })
  sort: SearchSort = SearchSort.RELEVANCE;

  @Field(() => Int, { defaultValue: 30 })
  limit: number = 30;

  @Field(() => Int, { defaultValue: 0 })
  offset: number = 0;
}
