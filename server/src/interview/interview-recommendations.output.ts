import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InterviewRecommendationsOutput {
  @Field(() => [String])
  topics: string[];

  @Field(() => [String])
  likelyQuestions: string[];

  @Field(() => [String])
  emphasize: string[];
}
