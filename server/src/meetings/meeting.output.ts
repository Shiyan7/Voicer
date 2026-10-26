import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MeetingStatus } from './meeting.entity';

registerEnumType(MeetingStatus, { name: 'MeetingStatus' });

@ObjectType()
export class MeetingOutput {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  title: string | null;

  @Field(() => String, { nullable: true })
  source: string | null;

  @Field(() => String, { nullable: true })
  audioUrl: string | null;

  @Field(() => MeetingStatus)
  status: MeetingStatus;

  @Field()
  startedAt: Date;

  @Field(() => Date, { nullable: true })
  endedAt: Date | null;

  @Field(() => Int, { nullable: true })
  durationSec: number | null;

  @Field()
  isFavorite: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
