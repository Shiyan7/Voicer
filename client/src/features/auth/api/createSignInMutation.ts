import type { AuthPayload } from '@schema';
import { createMutation } from '@urql/solid';

import { SIGN_IN_MUTATION } from './gql/SIGN_IN_MUTATION';

interface SignInMutation {
  signIn: AuthPayload;
}

export const createSignInMutation = () =>
  createMutation<SignInMutation>(SIGN_IN_MUTATION);
