import { gql } from '@urql/solid';

export const DELETE_CHAT_THREAD_MUTATION = gql`
  mutation DeleteChatThread($threadId: ID!) {
    deleteChatThread(threadId: $threadId)
  }
`;
