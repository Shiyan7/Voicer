import { Field, InputType } from '@nestjs/graphql';
import { DatedPageInput } from '../common/listing/dated-page.input';
import { MeetingsSort } from './meetings-sort.enum';

@InputType()
export class MeetingsPageInput extends DatedPageInput {
  @Field({ defaultValue: false })
  favoritesOnly: boolean = false;

  @Field(() => MeetingsSort, { defaultValue: MeetingsSort.DATE_DESC })
  sort: MeetingsSort = MeetingsSort.DATE_DESC;

  @Field(() => [String], { nullable: true })
  sources?: string[] | null;
}
