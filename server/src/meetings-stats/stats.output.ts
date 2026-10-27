import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatsSummaryOutput {
  @Field(() => [Int])
  years: number[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  durationSec: number;

  @Field(() => Int)
  activeDays: number;

  @Field(() => Int)
  longestStreak: number;
}

@ObjectType()
export class StatsCalendarDayOutput {
  @Field()
  date: string;

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  durationSec: number;
}

@ObjectType()
export class StatsSourceOutput {
  @Field(() => String, { nullable: true })
  source: string | null;

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  durationSec: number;
}

@ObjectType()
export class StatsYearOutput {
  @Field(() => [StatsCalendarDayOutput])
  days: StatsCalendarDayOutput[];

  @Field(() => [StatsSourceOutput])
  sources: StatsSourceOutput[];
}

@ObjectType()
export class StatsDayMeetingOutput {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  title: string | null;

  @Field(() => String, { nullable: true })
  source: string | null;

  @Field()
  startedAt: Date;

  @Field(() => Int, { nullable: true })
  durationSec: number | null;
}
