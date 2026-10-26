import { registerEnumType } from '@nestjs/graphql';

export enum SearchMatchKind {
  TRANSCRIPT = 'TRANSCRIPT',
  KEY_POINT = 'KEY_POINT',
  ACTION_ITEM = 'ACTION_ITEM',
  SOURCE = 'SOURCE',
}

registerEnumType(SearchMatchKind, { name: 'SearchMatchKind' });
