import { Field, ObjectType } from '@nestjs/graphql';
import { PagePaginationMetaOutput } from '../common/listing/page-pagination-meta.output';
import { InterviewSessionOutput } from './interview-session.output';

@ObjectType()
export class InterviewSessionsPageOutput {
  @Field(() => [InterviewSessionOutput])
  items: InterviewSessionOutput[];

  @Field(() => PagePaginationMetaOutput)
  meta: PagePaginationMetaOutput;
}
