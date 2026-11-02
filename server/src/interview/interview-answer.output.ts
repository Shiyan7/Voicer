import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InterviewAnswerOutput {
  @Field(() => ID)
  answerId: string;

  @Field()
  question: string;

  @Field()
  text: string;

  @Field()
  done: boolean;
}
