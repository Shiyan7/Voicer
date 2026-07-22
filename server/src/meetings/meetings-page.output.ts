import { Field, ObjectType } from '@nestjs/graphql';
import { MeetingOutput } from './meeting.output';
import { PagePaginationMetaOutput } from './page-pagination-meta.output';

@ObjectType()
export class MeetingsPageOutput {
  @Field(() => [MeetingOutput])
  items: MeetingOutput[];

  @Field(() => PagePaginationMetaOutput)
  meta: PagePaginationMetaOutput;
}
