import { Field, InputType } from '@nestjs/graphql';
import { PageInput } from './page.input';

@InputType({ isAbstract: true })
export abstract class DatedPageInput extends PageInput {
  @Field(() => Date, { nullable: true })
  from?: Date | null;

  @Field(() => Date, { nullable: true })
  to?: Date | null;
}
