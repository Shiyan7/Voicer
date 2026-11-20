import { gql } from '@urql/solid';

import { CHAT_MESSAGE_FIELDS } from './CHAT_MESSAGE_FIELDS';

export const CHAT_MESSAGE_SUBSCRIPTION = gql`
  subscription ChatMessage($threadId: ID!) {
    chatMessage(threadId: $threadId) {
      ${CHAT_MESSAGE_FIELDS}
    }
  }
`;
