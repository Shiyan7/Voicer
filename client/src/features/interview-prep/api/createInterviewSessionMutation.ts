import type {
  InterviewSessionOutput,
  MutationCreateInterviewSessionArgs,
} from '@schema';
import { createMutation } from '@urql/solid';

import { CREATE_INTERVIEW_SESSION_MUTATION } from './gql/CREATE_INTERVIEW_SESSION_MUTATION';

interface CreateInterviewSessionMutation {
  createInterviewSession: Pick<
    InterviewSessionOutput,
    'id' | 'recommendations'
  >;
}

export const createInterviewSessionMutation = () =>
  createMutation<
    CreateInterviewSessionMutation,
    MutationCreateInterviewSessionArgs
  >(CREATE_INTERVIEW_SESSION_MUTATION);
