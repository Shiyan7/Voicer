import { Field, ID, ObjectType } from '@nestjs/graphql';
import { InterviewLanguage } from './interview-language.enum';
import { InterviewPrepStatus } from './interview-prep-status.enum';
import { InterviewRecommendationsOutput } from './interview-recommendations.output';

@ObjectType()
export class InterviewSessionOutput {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  title: string | null;

  @Field(() => String)
  vacancyText: string;

  @Field(() => InterviewLanguage)
  language: InterviewLanguage;

  @Field(() => InterviewPrepStatus)
  prepStatus: InterviewPrepStatus;

  @Field(() => InterviewRecommendationsOutput, { nullable: true })
  recommendations: InterviewRecommendationsOutput | null;

  @Field(() => Date, { nullable: true })
  finishedAt: Date | null;

  @Field(() => ID, { nullable: true })
  meetingId: string | null;

  @Field(() => String, { nullable: true })
  recordingUrl: string | null;

  @Field()
  createdAt: Date;
}
