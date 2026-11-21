import { gql } from '@urql/solid';

export const SET_CHAT_THREAD_PINNED_MUTATION = gql`
  mutation SetChatThreadPinned($threadId: ID!, $isPinned: Boolean!) {
    setChatThreadPinned(threadId: $threadId, isPinned: $isPinned) {
      id
      isPinned
    }
  }
`;
