/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: File; output: File };
};

export type ActionItemOutput = {
  __typename?: 'ActionItemOutput';
  atMs?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDone: Scalars['Boolean']['output'];
  meetingId: Scalars['ID']['output'];
  meetingSource?: Maybe<Scalars['String']['output']>;
  meetingStartedAt: Scalars['DateTime']['output'];
  meetingTitle?: Maybe<Scalars['String']['output']>;
  speakerIndex?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
};

export type ChatMessageOutput = {
  __typename?: 'ChatMessageOutput';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  followUps: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isFailed: Scalars['Boolean']['output'];
  isStreaming: Scalars['Boolean']['output'];
  meetingId: Scalars['ID']['output'];
  role: ChatRole;
};

export enum ChatRole {
  Assistant = 'ASSISTANT',
  User = 'USER',
}

export type KeyPointOutput = {
  __typename?: 'KeyPointOutput';
  atMs?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  meetingId: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type MeetingOutput = {
  __typename?: 'MeetingOutput';
  audioUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  durationSec?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isFavorite: Scalars['Boolean']['output'];
  source?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['DateTime']['output'];
  status: MeetingStatus;
  summarizationFailed: Scalars['Boolean']['output'];
  summaryStyle?: Maybe<SummaryStyle>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum MeetingStatus {
  Failed = 'FAILED',
  Ready = 'READY',
  Summarizing = 'SUMMARIZING',
  Transcribed = 'TRANSCRIBED',
  Transcribing = 'TRANSCRIBING',
}

export type MeetingsPageInput = {
  favoritesOnly?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  sort?: MeetingsSort;
  sources?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type MeetingsPageOutput = {
  __typename?: 'MeetingsPageOutput';
  items: Array<MeetingOutput>;
  meta: PagePaginationMetaOutput;
};

export enum MeetingsSort {
  DateAsc = 'DATE_ASC',
  DateDesc = 'DATE_DESC',
  DurationAsc = 'DURATION_ASC',
  DurationDesc = 'DURATION_DESC',
}

export type MeetingsStatsOutput = {
  __typename?: 'MeetingsStatsOutput';
  openActionItems: Scalars['Int']['output'];
  sources: Array<Scalars['String']['output']>;
  weekCount: Scalars['Int']['output'];
  weekDurationSec: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  meetingChatAsk: ChatMessageOutput;
  meetingChatClear: Scalars['Boolean']['output'];
  meetingDelete: MeetingOutput;
  meetingRename: MeetingOutput;
  meetingSetFavorite: MeetingOutput;
  meetingSuggestTitle: Scalars['String']['output'];
  meetingSummarize: MeetingOutput;
  meetingUploadAudio: MeetingOutput;
  signIn: AuthPayload;
  signUp: AuthPayload;
  toggleActionItem: Scalars['Boolean']['output'];
};

export type MutationMeetingChatAskArgs = {
  meetingId: Scalars['ID']['input'];
  question: Scalars['String']['input'];
};

export type MutationMeetingChatClearArgs = {
  meetingId: Scalars['ID']['input'];
};

export type MutationMeetingDeleteArgs = {
  id: Scalars['ID']['input'];
};

export type MutationMeetingRenameArgs = {
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type MutationMeetingSetFavoriteArgs = {
  id: Scalars['ID']['input'];
  isFavorite: Scalars['Boolean']['input'];
};

export type MutationMeetingSuggestTitleArgs = {
  id: Scalars['ID']['input'];
};

export type MutationMeetingSummarizeArgs = {
  id: Scalars['ID']['input'];
  style?: SummaryStyle;
};

export type MutationMeetingUploadAudioArgs = {
  file: Scalars['Upload']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
  startedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type MutationSignInArgs = {
  input: SignInInput;
};

export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type MutationToggleActionItemArgs = {
  id: Scalars['ID']['input'];
};

export type PagePaginationMetaOutput = {
  __typename?: 'PagePaginationMetaOutput';
  hasNextItems: Scalars['Boolean']['output'];
  hasPrevItems: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  actionItems: Array<ActionItemOutput>;
  meetingActionItems: Array<ActionItemOutput>;
  meetingChatMessages: Array<ChatMessageOutput>;
  meetingChatSuggestions: Array<Scalars['String']['output']>;
  meetingKeyPoints: Array<KeyPointOutput>;
  meetingTranscript: Array<TranscriptSegmentOutput>;
  meetingsPage: MeetingsPageOutput;
  meetingsStats: MeetingsStatsOutput;
  search: SearchPageOutput;
  statsDayMeetings: Array<StatsDayMeetingOutput>;
  statsSummary: StatsSummaryOutput;
  statsYear: StatsYearOutput;
  userMe: UserMeOutput;
};

export type QueryMeetingActionItemsArgs = {
  meetingId: Scalars['ID']['input'];
};

export type QueryMeetingChatMessagesArgs = {
  meetingId: Scalars['ID']['input'];
};

export type QueryMeetingChatSuggestionsArgs = {
  meetingId: Scalars['ID']['input'];
};

export type QueryMeetingKeyPointsArgs = {
  meetingId: Scalars['ID']['input'];
};

export type QueryMeetingTranscriptArgs = {
  meetingId: Scalars['ID']['input'];
};

export type QueryMeetingsPageArgs = {
  input: MeetingsPageInput;
};

export type QuerySearchArgs = {
  input: SearchInput;
};

export type QueryStatsDayMeetingsArgs = {
  input: StatsDayMeetingsInput;
};

export type QueryStatsSummaryArgs = {
  input: StatsSummaryInput;
};

export type QueryStatsYearArgs = {
  input: StatsYearInput;
};

export type SearchInput = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
  sort?: SearchSort;
};

export enum SearchMatchKind {
  ActionItem = 'ACTION_ITEM',
  KeyPoint = 'KEY_POINT',
  Source = 'SOURCE',
  Transcript = 'TRANSCRIPT',
}

export type SearchPageOutput = {
  __typename?: 'SearchPageOutput';
  items: Array<SearchResultOutput>;
  total: Scalars['Int']['output'];
};

export type SearchResultOutput = {
  __typename?: 'SearchResultOutput';
  atMs?: Maybe<Scalars['Int']['output']>;
  durationSec?: Maybe<Scalars['Int']['output']>;
  kind: SearchMatchKind;
  matchCount: Scalars['Int']['output'];
  matchId: Scalars['ID']['output'];
  meetingId: Scalars['ID']['output'];
  source?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['DateTime']['output'];
  text: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export enum SearchSort {
  Recent = 'RECENT',
  Relevance = 'RELEVANCE',
}

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type StatsCalendarDayOutput = {
  __typename?: 'StatsCalendarDayOutput';
  count: Scalars['Int']['output'];
  date: Scalars['String']['output'];
  durationSec: Scalars['Int']['output'];
};

export type StatsDayMeetingOutput = {
  __typename?: 'StatsDayMeetingOutput';
  durationSec?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  source?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['DateTime']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type StatsDayMeetingsInput = {
  date: Scalars['String']['input'];
  timeZone: Scalars['String']['input'];
};

export type StatsSourceOutput = {
  __typename?: 'StatsSourceOutput';
  count: Scalars['Int']['output'];
  durationSec: Scalars['Int']['output'];
  source?: Maybe<Scalars['String']['output']>;
};

export type StatsSummaryInput = {
  timeZone: Scalars['String']['input'];
};

export type StatsSummaryOutput = {
  __typename?: 'StatsSummaryOutput';
  activeDays: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  durationSec: Scalars['Int']['output'];
  longestStreak: Scalars['Int']['output'];
  years: Array<Scalars['Int']['output']>;
};

export type StatsYearInput = {
  timeZone: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type StatsYearOutput = {
  __typename?: 'StatsYearOutput';
  days: Array<StatsCalendarDayOutput>;
  sources: Array<StatsSourceOutput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  meetingChatMessage: ChatMessageOutput;
  meetingUpdated: MeetingOutput;
};

export type SubscriptionMeetingChatMessageArgs = {
  meetingId: Scalars['ID']['input'];
};

export type SubscriptionMeetingUpdatedArgs = {
  id: Scalars['ID']['input'];
};

export enum SummaryStyle {
  Advice = 'ADVICE',
  Auto = 'AUTO',
  Bullets = 'BULLETS',
  Casual = 'CASUAL',
  Concise = 'CONCISE',
  Detailed = 'DETAILED',
  Interview = 'INTERVIEW',
  Work = 'WORK',
}

export type TranscriptSegmentOutput = {
  __typename?: 'TranscriptSegmentOutput';
  endMs: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  meetingId: Scalars['ID']['output'];
  speakerIndex: Scalars['Int']['output'];
  startMs: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type UserMeOutput = {
  __typename?: 'UserMeOutput';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};
