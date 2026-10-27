import type { MutationMeetingSuggestTitleArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { MEETING_SUGGEST_TITLE_MUTATION } from './gql/MEETING_SUGGEST_TITLE_MUTATION';

interface SuggestMeetingTitleMutation {
  meetingSuggestTitle: string;
}

export const suggestMeetingTitleMutation = () =>
  createMutation<SuggestMeetingTitleMutation, MutationMeetingSuggestTitleArgs>(
    MEETING_SUGGEST_TITLE_MUTATION,
  );
