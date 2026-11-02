import type { MutationDeleteInterviewResumeArgs } from '@schema';
import { createMutation } from '@urql/solid';

import { DELETE_INTERVIEW_RESUME_MUTATION } from './gql/DELETE_INTERVIEW_RESUME_MUTATION';

interface DeleteInterviewResumeMutation {
  deleteInterviewResume: boolean;
}

export const deleteInterviewResumeMutation = () =>
  createMutation<
    DeleteInterviewResumeMutation,
    MutationDeleteInterviewResumeArgs
  >(DELETE_INTERVIEW_RESUME_MUTATION);
