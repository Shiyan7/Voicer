import { registerEnumType } from '@nestjs/graphql';

export enum InterviewLanguage {
  RU = 'ru',
  EN = 'en',
  UK = 'uk',
}

registerEnumType(InterviewLanguage, { name: 'InterviewLanguage' });
