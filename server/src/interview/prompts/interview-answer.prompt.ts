import { InterviewLanguage } from '../interview-language.enum';
import { InterviewTurnEntity } from '../interview-turn.entity';

export interface InterviewAnswerContext {
  language: InterviewLanguage;
  cheatSheet: string;
  vacancyText: string;
  history: InterviewTurnEntity[];
}

const formatTurn = (turn: InterviewTurnEntity): string =>
  `Интервьюер: ${turn.question}\nКандидат: ${turn.answer}`;

const LANGUAGE_RULES: Record<InterviewLanguage, string> = {
  [InterviewLanguage.RU]: 'Отвечай на русском языке.',
  [InterviewLanguage.EN]: 'Отвечай только на английском языке.',
};

const STYLE_RULES = `Ты кандидат на собеседовании и отвечаешь вслух от первого лица.
Говори разговорно, как живой человек: короткие предложения, простые слова.
Без markdown: никаких списков, заголовков, жирного текста.
Без штампов вроде «отличный вопрос», «важно отметить», «таким образом», «в заключение».
Начни с прямого ответа в одно-два предложения, затем добавь ещё несколько предложений с конкретикой.
Опирайся на конкретные факты из шпаргалки: проекты, стек, цифры. Не выдумывай опыт, которого там нет.
Если вопрос про код или задачу на программирование, дай простой читаемый блок кода в ограждении \`\`\`язык и одно предложение устного пояснения.`;

export function buildInterviewAnswerInstruction(
  context: InterviewAnswerContext,
): string {
  const sections = [
    STYLE_RULES,
    LANGUAGE_RULES[context.language],
    `Шпаргалка кандидата:\n${context.cheatSheet}`,
    `Вакансия:\n${context.vacancyText}`,
  ];
  if (context.history.length) {
    sections.push(
      `Недавний ход разговора:\n${context.history.map(formatTurn).join('\n\n')}`,
    );
  }
  return sections.join('\n\n');
}

export const SCREENSHOT_QUESTION_LABEL = 'Задача со скриншота';

export const SCREENSHOT_TASK_PROMPT = `На скриншоте экран собеседования с задачей на программирование.
Прочитай условие и реши задачу: сначала одно-два предложения о подходе, затем код решения в ограждении \`\`\`язык, затем коротко про сложность.
Если на экране уже есть код кандидата, продолжай его в том же языке и стиле.`;
