import type { InterviewAnswerOutput } from '@schema';

interface AnswerTrackerHandlers {
  onAnswer: (turnId: string, text: string) => void;
  onBusyChange: (isBusy: boolean) => void;
}

export const createAnswerTracker = ({
  onAnswer,
  onBusyChange,
}: AnswerTrackerHandlers) => {
  const answerTurns = new Map<string, string>();
  const unmatchedAnswers = new Map<string, InterviewAnswerOutput>();
  const activeAnswers = new Set<string>();
  let pendingRequests = 0;

  const emitBusy = () =>
    onBusyChange(activeAnswers.size > 0 || pendingRequests > 0);

  const emitAnswer = (turnId: string, output: InterviewAnswerOutput) => {
    onAnswer(turnId, output.text);
    if (!output.done) return;
    activeAnswers.delete(output.answerId);
    emitBusy();
  };

  const beginRequest = () => {
    pendingRequests += 1;
    emitBusy();
  };

  const endRequest = () => {
    pendingRequests -= 1;
    emitBusy();
  };

  const link = (answerId: string, turnId: string) => {
    answerTurns.set(answerId, turnId);
    activeAnswers.add(answerId);
    emitBusy();
    const pending = unmatchedAnswers.get(answerId);
    unmatchedAnswers.delete(answerId);
    if (pending) emitAnswer(turnId, pending);
  };

  const receive = (output: InterviewAnswerOutput) => {
    const turnId = answerTurns.get(output.answerId);
    if (turnId) emitAnswer(turnId, output);
    else unmatchedAnswers.set(output.answerId, output);
  };

  return { beginRequest, endRequest, link, receive };
};
