import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { SearchResultOutput } from './search-result.output';
import { SearchInput } from './search.input';
import { SearchService } from './search.service';

@Resolver(() => SearchResultOutput)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [SearchResultOutput])
  search(
    @CurrentUser() user: UserEntity,
    @Args('input', { type: () => SearchInput }) input: SearchInput,
  ): Promise<SearchResultOutput[]> {
    return this.searchService.search(user.id, input);
  }
}
