import { gql } from '@urql/solid';

export const API_TOKENS_QUERY = gql`
  query ApiTokens {
    apiTokens {
      id
      name
      lastUsedAt
      createdAt
    }
  }
`;
