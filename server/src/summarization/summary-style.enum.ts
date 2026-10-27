import { registerEnumType } from '@nestjs/graphql';

export enum SummaryStyle {
  AUTO = 'auto',
  CONCISE = 'concise',
  DETAILED = 'detailed',
  BULLETS = 'bullets',
  CASUAL = 'casual',
  WORK = 'work',
  INTERVIEW = 'interview',
  ADVICE = 'advice',
}

registerEnumType(SummaryStyle, { name: 'SummaryStyle' });
