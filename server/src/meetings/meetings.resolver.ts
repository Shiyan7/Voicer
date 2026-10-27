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
import { UserEntity } from '../users/user.entity';
import { FileUpload } from '../file/file-upload';
import { MeetingOutput } from './meeting.output';
import { MeetingsPageInput } from './meetings-page.input';
import { MeetingsPageOutput } from './meetings-page.output';
import { TranscriptSegmentOutput } from './transcript-segment.output';
import { KeyPointOutput } from './key-point.output';
import { MeetingsService } from './meetings.service';
import { SummaryStyle } from '../summarization/summary-style.enum';

@Resolver(() => MeetingOutput)
export class MeetingsResolver {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Query(() => MeetingsPageOutput)
  meetingsPage(
    @CurrentUser() user: UserEntity,
    @Args('input', { type: () => MeetingsPageInput })
    input: MeetingsPageInput,
  ): Promise<MeetingsPageOutput> {
    return this.meetingsService.getUserMeetingsPage(user.id, input);
  }

  @Mutation(() => MeetingOutput)
  async meetingUploadAudio(
    @CurrentUser() user: UserEntity,
    @Args({ name: 'file', type: () => GraphQLUpload })
    upload: FileUpload,
    @Args('source', { type: () => String, nullable: true })
    source?: string,
    @Args('startedAt', { type: () => Date, nullable: true })
    startedAt?: Date,
  ): Promise<MeetingOutput> {
    return this.meetingsService.createFromUpload(user.id, await upload, {
      source,
      startedAt,
    });
  }

  @Mutation(() => MeetingOutput)
  meetingSummarize(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
    @Args('style', {
      type: () => SummaryStyle,
      defaultValue: SummaryStyle.AUTO,
    })
    style: SummaryStyle,
  ): Promise<MeetingOutput> {
    return this.meetingsService.summarizeMeeting(user.id, id, style);
  }

  @Mutation(() => MeetingOutput)
  meetingSetFavorite(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
    @Args('isFavorite') isFavorite: boolean,
  ): Promise<MeetingOutput> {
    return this.meetingsService.setMeetingFavorite(user.id, id, isFavorite);
  }

  @Mutation(() => MeetingOutput)
  meetingRename(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
    @Args('title', { type: () => String, nullable: true }) title: string | null,
  ): Promise<MeetingOutput> {
    return this.meetingsService.renameMeeting(user.id, id, title);
  }

  @Mutation(() => String)
  meetingSuggestTitle(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<string> {
    return this.meetingsService.suggestMeetingTitle(user.id, id);
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
