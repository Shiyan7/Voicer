import type {
  InterviewSessionOutput,
  MutationDeleteInterviewSessionArgs,
} from '@schema';
import { createMutation } from '@urql/solid';

import { DELETE_INTERVIEW_SESSION_MUTATION } from './gql/DELETE_INTERVIEW_SESSION_MUTATION';

interface DeleteInterviewSessionMutation {
  deleteInterviewSession: Pick<InterviewSessionOutput, 'id'>;
}

export const deleteInterviewSessionMutation = () =>
  createMutation<
    DeleteInterviewSessionMutation,
    MutationDeleteInterviewSessionArgs
  >(DELETE_INTERVIEW_SESSION_MUTATION);
