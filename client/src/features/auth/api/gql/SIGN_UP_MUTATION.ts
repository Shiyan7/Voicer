import { gql } from '@urql/solid';

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      accessToken
    }
  }
`;
