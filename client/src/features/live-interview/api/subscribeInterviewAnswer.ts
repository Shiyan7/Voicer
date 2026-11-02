import type {
  InterviewAnswerOutput,
  SubscriptionInterviewAnswerArgs,
} from '@schema';

import { urqlClient } from '@/shared/urql-client';

import { INTERVIEW_ANSWER_SUBSCRIPTION } from './gql/INTERVIEW_ANSWER_SUBSCRIPTION';

interface InterviewAnswerResult {
  interviewAnswer: InterviewAnswerOutput;
}

export const subscribeInterviewAnswer = (
  variables: SubscriptionInterviewAnswerArgs,
  onAnswer: (answer: InterviewAnswerOutput) => void,
) => {
  const subscription = urqlClient
    .subscription<
      InterviewAnswerResult,
      SubscriptionInterviewAnswerArgs
    >(INTERVIEW_ANSWER_SUBSCRIPTION, variables)
    .subscribe((result) => {
      if (result.data) onAnswer(result.data.interviewAnswer);
    });
  return () => subscription.unsubscribe();
};
