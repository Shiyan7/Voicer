import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserEntity } from '../users/user.entity';
import { FileUpload } from '../file/file-upload';
import { MeetingOutput } from './meeting.output';
import { TranscriptSegmentOutput } from './transcript-segment.output';
import { KeyPointOutput } from './key-point.output';
import { MeetingsService } from './meetings.service';

@Resolver(() => MeetingOutput)
export class MeetingsResolver {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Query(() => [MeetingOutput])
  meetings(@CurrentUser() user: UserEntity): Promise<MeetingOutput[]> {
    return this.meetingsService.getUserMeetings(user.id);
  }

  @Mutation(() => MeetingOutput)
  async meetingUploadAudio(
    @CurrentUser() user: UserEntity,
    @Args({ name: 'file', type: () => GraphQLUpload })
    upload: FileUpload,
  ): Promise<MeetingOutput> {
    return this.meetingsService.createFromUpload(user.id, await upload);
  }

  @Mutation(() => MeetingOutput)
  meetingDelete(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<MeetingOutput> {
    return this.meetingsService.deleteMeeting(user.id, id);
  }

  @Query(() => MeetingOutput)
  meeting(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<MeetingOutput> {
    return this.meetingsService.getMeetingById(user.id, id);
  }

  @Query(() => [TranscriptSegmentOutput])
  meetingTranscript(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<TranscriptSegmentOutput[]> {
    return this.meetingsService.getMeetingTranscript(user.id, meetingId);
  }

  @Public()
  @Subscription(() => MeetingOutput, {
    name: 'meetingUpdated',
  })
  meetingUpdated(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
  ): AsyncIterator<{ meetingUpdated: MeetingOutput }> {
    return this.meetingsService.subscribeToMeetingUpdated(user.id, id);
  }

  @Query(() => [KeyPointOutput])
  meetingKeyPoints(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<KeyPointOutput[]> {
    return this.meetingsService.getMeetingKeyPoints(user.id, meetingId);
  }
}
