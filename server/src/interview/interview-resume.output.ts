import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InterviewResumeOutput {
  @Field(() => ID)
  sessionId: string;

  @Field(() => String)
  fileName: string;
}
