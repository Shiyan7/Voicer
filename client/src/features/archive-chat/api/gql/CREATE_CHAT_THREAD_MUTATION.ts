import { gql } from '@urql/solid';

export const CREATE_CHAT_THREAD_MUTATION = gql`
  mutation CreateChatThread {
    createChatThread {
      id
    }
  }
`;
