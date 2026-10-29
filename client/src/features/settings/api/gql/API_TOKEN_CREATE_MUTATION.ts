import { gql } from '@urql/solid';

export const API_TOKEN_CREATE_MUTATION = gql`
  mutation ApiTokenCreate($name: String!) {
    apiTokenCreate(name: $name) {
      secret
      apiToken {
        id
      }
    }
  }
`;
