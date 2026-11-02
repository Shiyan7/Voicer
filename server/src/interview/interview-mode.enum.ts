import { registerEnumType } from '@nestjs/graphql';

export enum InterviewMode {
  REAL = 'real',
  MOCK = 'mock',
}

registerEnumType(InterviewMode, { name: 'InterviewMode' });
