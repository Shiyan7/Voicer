import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PagePaginationMetaOutput {
  @Field(() => Int)
  page: number;

  @Field(() => Boolean)
  hasNextItems: boolean;

  @Field(() => Boolean)
  hasPrevItems: boolean;

  @Field(() => Int)
  total: number;
}
