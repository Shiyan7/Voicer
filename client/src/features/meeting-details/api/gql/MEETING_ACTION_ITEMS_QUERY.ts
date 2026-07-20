import { gql } from '@urql/solid';

export const MEETING_ACTION_ITEMS_QUERY = gql`
  query MeetingActionItems($meetingId: ID!) {
    meetingActionItems(meetingId: $meetingId) {
      id
      meetingId
      text
      isDone
      speakerIndex
      atMs
      dueDate
      createdAt
      meetingSource
      meetingStartedAt
    }
  }
`;
