import { gql } from '@urql/solid';

import { CHAT_MESSAGE_FIELDS } from './CHAT_MESSAGE_FIELDS';

export const CHAT_ASK_MUTATION = gql`
  mutation ChatAsk($threadId: ID!, $question: String!) {
    chatAsk(threadId: $threadId, question: $question) {
      ${CHAT_MESSAGE_FIELDS}
    }
  }
`;
