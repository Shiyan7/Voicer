import { gql } from '@urql/solid';

export const CHAT_CLEAR_MUTATION = gql`
  mutation ChatClear($threadId: ID!) {
    chatClear(threadId: $threadId)
  }
`;
