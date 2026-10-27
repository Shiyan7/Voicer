import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SearchResultOutput } from './search-result.output';

@ObjectType()
export class SearchPageOutput {
  @Field(() => [SearchResultOutput])
  items: SearchResultOutput[];

  @Field(() => Int)
  total: number;
}
