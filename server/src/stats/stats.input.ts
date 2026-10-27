import { Field, InputType, Int } from '@nestjs/graphql';
import { IsISO8601, Matches, Max, Min } from 'class-validator';
import { IsTimeZone } from './is-time-zone.validator';

@InputType({ isAbstract: true })
abstract class StatsTimeZoneInput {
  @Field()
  @IsTimeZone()
  timeZone: string;
}

@InputType()
export class StatsSummaryInput extends StatsTimeZoneInput {}

@InputType()
export class StatsYearInput extends StatsTimeZoneInput {
  @Field(() => Int)
  @Min(1970)
  @Max(9999)
  year: number;
}

@InputType()
export class StatsDayMeetingsInput extends StatsTimeZoneInput {
  @Field()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsISO8601({ strict: true })
  date: string;
}
