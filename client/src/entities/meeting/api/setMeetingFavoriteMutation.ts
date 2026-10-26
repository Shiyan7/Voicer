import type { MeetingOutput, MutationMeetingSetFavoriteArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { MEETING_SET_FAVORITE_MUTATION } from './gql/MEETING_SET_FAVORITE_MUTATION';

interface MeetingSetFavoriteMutation {
  meetingSetFavorite: Pick<MeetingOutput, 'id' | 'isFavorite'>;
}

export const setMeetingFavoriteMutation = () =>
  createMutation<MeetingSetFavoriteMutation, MutationMeetingSetFavoriteArgs>(
    MEETING_SET_FAVORITE_MUTATION,
  );
