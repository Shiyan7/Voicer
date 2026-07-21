import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CursorPaginationMetaOutput {
  @Field(() => String, { nullable: true })
  nextCursor: string | null;

  @Field(() => Boolean)
  hasNextItems: boolean;
}
