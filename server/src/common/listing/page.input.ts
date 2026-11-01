import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export abstract class PageInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  limit: number = 10;
}
