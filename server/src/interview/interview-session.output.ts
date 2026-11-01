import { Field, ID, ObjectType } from '@nestjs/graphql';
import { InterviewRecommendationsOutput } from './interview-recommendations.output';

@ObjectType()
export class InterviewSessionOutput {
  @Field(() => ID)
  id: string;

  @Field()
  resumeText: string;

  @Field()
  vacancyText: string;

  @Field()
  cheatSheet: string;

  @Field(() => InterviewRecommendationsOutput)
  recommendations: InterviewRecommendationsOutput;

  @Field(() => Date, { nullable: true })
  finishedAt: Date | null;

  @Field(() => ID, { nullable: true })
  meetingId: string | null;

  @Field()
  createdAt: Date;
}
