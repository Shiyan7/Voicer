import type {
  InterviewSessionOutput,
  MutationRetryInterviewPreparationArgs,
} from '@schema';
import { createMutation } from '@urql/solid';

import { RETRY_INTERVIEW_PREPARATION_MUTATION } from './gql/RETRY_INTERVIEW_PREPARATION_MUTATION';

interface RetryInterviewPreparationMutation {
  retryInterviewPreparation: Pick<InterviewSessionOutput, 'id' | 'prepStatus'>;
}

export const retryInterviewPreparationMutation = () =>
  createMutation<
    RetryInterviewPreparationMutation,
    MutationRetryInterviewPreparationArgs
  >(RETRY_INTERVIEW_PREPARATION_MUTATION);
