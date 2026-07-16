import { gql } from '@urql/solid';

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      accessToken
    }
  }
`;
