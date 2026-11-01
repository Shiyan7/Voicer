import { registerEnumType } from '@nestjs/graphql';

export enum InterviewSessionsSort {
  DATE_DESC = 'DATE_DESC',
  DATE_ASC = 'DATE_ASC',
}

registerEnumType(InterviewSessionsSort, { name: 'InterviewSessionsSort' });
