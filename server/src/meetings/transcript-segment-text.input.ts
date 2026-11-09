import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class TranscriptSegmentTextInput {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;
}
