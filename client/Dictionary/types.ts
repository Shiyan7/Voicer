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
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isDone: Scalars['Boolean']['output'];
  meetingId: Scalars['ID']['output'];
  meetingTitle?: Maybe<Scalars['String']['output']>;
  speakerIndex?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
};

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
  source?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['DateTime']['output'];
  status: MeetingStatus;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum MeetingStatus {
  Failed = 'FAILED',
  Ready = 'READY',
  Recording = 'RECORDING',
  Summarizing = 'SUMMARIZING',
  Transcribing = 'TRANSCRIBING',
}

export type Mutation = {
  __typename?: 'Mutation';
  meetingDelete: MeetingOutput;
  meetingUploadAudio: MeetingOutput;
  signIn: AuthPayload;
  signUp: AuthPayload;
  toggleActionItem: Scalars['Boolean']['output'];
};

export type MutationMeetingDeleteArgs = {
  id: Scalars['ID']['input'];
};

export type MutationMeetingUploadAudioArgs = {
  file: Scalars['Upload']['input'];
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

export type Query = {
  __typename?: 'Query';
  actionItems: Array<ActionItemOutput>;
  meeting: MeetingOutput;
  meetingActionItems: Array<ActionItemOutput>;
  meetingKeyPoints: Array<KeyPointOutput>;
  meetingTranscript: Array<TranscriptSegmentOutput>;
  meetings: Array<MeetingOutput>;
  userMe: UserMeOutput;
};

export type QueryMeetingArgs = {
  id: Scalars['ID']['input'];
};

export type QueryMeetingActionItemsArgs = {
  meetingId: Scalars['ID']['input'];
};

export type QueryMeetingKeyPointsArgs = {
  meetingId: Scalars['ID']['input'];
};

export type QueryMeetingTranscriptArgs = {
  meetingId: Scalars['ID']['input'];
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  meetingUpdated: MeetingOutput;
};

export type SubscriptionMeetingUpdatedArgs = {
  id: Scalars['ID']['input'];
};

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
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};
