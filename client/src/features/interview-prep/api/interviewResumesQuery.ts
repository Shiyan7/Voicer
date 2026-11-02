import type { InterviewResumeOutput } from '@schema';
import { createQuery } from '@urql/solid';

import { INTERVIEW_RESUMES_QUERY } from './gql/INTERVIEW_RESUMES_QUERY';

interface InterviewResumesQuery {
  interviewResumes: InterviewResumeOutput[];
}

export const interviewResumesQuery = () =>
  createQuery<InterviewResumesQuery>({
    query: INTERVIEW_RESUMES_QUERY,
    requestPolicy: 'network-only',
  });
