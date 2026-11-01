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

  @Field(() => String, { nullable: true })
  styleSamples: string | null;

  @Field()
  createdAt: Date;
}
