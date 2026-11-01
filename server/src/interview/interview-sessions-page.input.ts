import { Field, InputType } from '@nestjs/graphql';
import { DatedPageInput } from '../common/listing/dated-page.input';
import { InterviewSessionStatus } from './interview-session-status.enum';
import { InterviewSessionsSort } from './interview-sessions-sort.enum';

@InputType()
export class InterviewSessionsPageInput extends DatedPageInput {
  @Field(() => InterviewSessionsSort, {
    defaultValue: InterviewSessionsSort.DATE_DESC,
  })
  sort: InterviewSessionsSort = InterviewSessionsSort.DATE_DESC;

  @Field(() => InterviewSessionStatus, { nullable: true })
  status?: InterviewSessionStatus | null;
}
