import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ApiTokenOutput {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Date, { nullable: true })
  lastUsedAt: Date | null;

  @Field()
  createdAt: Date;
}
