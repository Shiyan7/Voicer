import { Field, ObjectType } from '@nestjs/graphql';
import { MeetingOutput } from './meeting.output';
import { CursorPaginationMetaOutput } from './cursor-pagination-meta.output';

@ObjectType()
export class MeetingsPageOutput {
  @Field(() => [MeetingOutput])
  items: MeetingOutput[];

  @Field(() => CursorPaginationMetaOutput)
  meta: CursorPaginationMetaOutput;
}
