import { gql } from '@urql/solid';

import { CHAT_MESSAGE_FIELDS } from './CHAT_MESSAGE_FIELDS';

export const CHAT_MESSAGES_QUERY = gql`
  query ChatMessages($threadId: ID!) {
    chatMessages(threadId: $threadId) {
      ${CHAT_MESSAGE_FIELDS}
    }
  }
`;
