import type { AuthPayload } from '@schema';
import { createMutation } from '@urql/solid';

import { SIGN_UP_MUTATION } from './gql/SIGN_UP_MUTATION';

interface SignUpMutation {
  signUp: AuthPayload;
}

export const createSignUpMutation = () =>
  createMutation<SignUpMutation>(SIGN_UP_MUTATION);
