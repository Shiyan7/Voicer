import { registerEnumType } from '@nestjs/graphql';

export enum InterviewPrepStatus {
  PREPARING = 'preparing',
  READY = 'ready',
  FAILED = 'failed',
}

registerEnumType(InterviewPrepStatus, { name: 'InterviewPrepStatus' });
