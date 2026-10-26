import { registerEnumType } from '@nestjs/graphql';

export enum MeetingsSort {
  DATE_DESC = 'DATE_DESC',
  DATE_ASC = 'DATE_ASC',
  DURATION_DESC = 'DURATION_DESC',
  DURATION_ASC = 'DURATION_ASC',
}

registerEnumType(MeetingsSort, { name: 'MeetingsSort' });
