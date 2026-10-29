import { gql } from '@urql/solid';

export const API_TOKEN_REVOKE_MUTATION = gql`
  mutation ApiTokenRevoke($id: ID!) {
    apiTokenRevoke(id: $id)
  }
`;
