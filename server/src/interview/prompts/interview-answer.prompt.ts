import { InterviewLanguage } from '../interview-language.enum';
import { InterviewTurnEntity } from '../interview-turn.entity';

interface InterviewAnswerContext {
  language: InterviewLanguage;
  cheatSheet: string;
  vacancyText: string;
  history: InterviewTurnEntity[];
  isGated: boolean;
}

const formatTurn = (turn: InterviewTurnEntity): string =>
  `Interviewer: ${turn.question}\nCandidate: ${turn.answer}`;

const LANGUAGE_RULES: Record<InterviewLanguage, string> = {
  [InterviewLanguage.RU]: 'Answer in Russian.',
  [InterviewLanguage.EN]: 'Answer only in English.',
  [InterviewLanguage.UK]: 'Answer only in Ukrainian.',
};

const STYLE_RULES = `You are the candidate in a job interview, answering out loud in the first person.
Speak conversationally, like a real person: short sentences, simple words.
No markdown: no lists, headings or bold text.
No clichés such as «отличный вопрос», «важно отметить», «таким образом», «в заключение» or their equivalents in other languages.
Start with a direct answer in one or two sentences, then add a few more sentences with specifics.
Rely on concrete facts from the cheat sheet: projects, stack, numbers. Do not invent experience that is not there.
If the question is about code or a programming task, give a simple readable code block in a \`\`\`language fence and one sentence of spoken explanation.`;

export const SKIP_ANSWER = 'SKIP';

const GATE_RULES = `Before answering, decide whether the interviewer expects a reply from the candidate. The text comes from speech recognition, so question marks and sentence endings may be missing.
Answer if it is a question, request or task, even without a question mark and even if the phrase is cut off but its meaning is clear.
If it is a story about the company or project, a comment, a reaction, an organizational remark or a fragment with no clear meaning, write exactly ${SKIP_ANSWER} and nothing else.`;

export function buildInterviewAnswerInstruction(
  context: InterviewAnswerContext,
): string {
  const sections = [
    STYLE_RULES,
    LANGUAGE_RULES[context.language],
    `Candidate cheat sheet:\n${context.cheatSheet}`,
    `Job description:\n${context.vacancyText}`,
  ];
  if (context.isGated) sections.push(GATE_RULES);
  if (context.history.length) {
    sections.push(
      `Recent conversation:\n${context.history.map(formatTurn).join('\n\n')}`,
    );
  }
  return sections.join('\n\n');
}

export const SCREENSHOT_QUESTION_LABEL = 'Задача со скриншота';

export const SCREENSHOT_TASK_PROMPT = `The screenshot shows an interview screen with a programming task.
Read the task and solve it: first one or two sentences about the approach, then the solution code in a \`\`\`language fence, then a short note on complexity.
If the screen already has the candidate's code, continue it in the same language and style.`;
