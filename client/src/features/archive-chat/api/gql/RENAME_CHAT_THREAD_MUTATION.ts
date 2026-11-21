import { gql } from '@urql/solid';

export const RENAME_CHAT_THREAD_MUTATION = gql`
  mutation RenameChatThread($threadId: ID!, $title: String!) {
    renameChatThread(threadId: $threadId, title: $title) {
      id
      title
    }
  }
`;
