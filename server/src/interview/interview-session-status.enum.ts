import { registerEnumType } from '@nestjs/graphql';

export enum InterviewSessionStatus {
  FINISHED = 'FINISHED',
  UNFINISHED = 'UNFINISHED',
}

registerEnumType(InterviewSessionStatus, { name: 'InterviewSessionStatus' });
