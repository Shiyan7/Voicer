import { registerEnumType } from '@nestjs/graphql';

export enum InterviewLanguage {
  RU = 'ru',
  EN = 'en',
}

registerEnumType(InterviewLanguage, { name: 'InterviewLanguage' });
