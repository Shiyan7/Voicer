import { registerEnumType } from '@nestjs/graphql';

export enum SearchSort {
  RELEVANCE = 'RELEVANCE',
  RECENT = 'RECENT',
}

registerEnumType(SearchSort, { name: 'SearchSort' });
