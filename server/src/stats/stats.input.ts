import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class StatsInput {
  @Field(() => Int)
  year: number;

  @Field()
  timeZone: string;
}

@InputType()
export class StatsDayInput {
  @Field()
  date: string;

  @Field()
  timeZone: string;
}
