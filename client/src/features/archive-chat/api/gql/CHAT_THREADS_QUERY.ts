import { gql } from '@urql/solid';

export const CHAT_THREADS_QUERY = gql`
  query ChatThreads {
    chatThreads {
      id
      title
      isPinned
    }
  }
`;
