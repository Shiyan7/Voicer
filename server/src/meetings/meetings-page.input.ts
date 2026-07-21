import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MeetingsPageInput {
  @Field(() => String, { nullable: true })
  afterCursor?: string | null;

  @Field(() => Int, { defaultValue: 10 })
  limit: number = 10;
}
