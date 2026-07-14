import { gql } from '@urql/solid';

export const REFRESH_MUTATION = gql`
  mutation Refresh($input: RefreshInput!) {
    refresh(input: $input) {
      accessToken
      refreshToken
    }
  }
`;
