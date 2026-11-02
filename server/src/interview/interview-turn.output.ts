import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InterviewTurnOutput {
  @Field(() => ID)
  id: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field()
  createdAt: Date;
}
