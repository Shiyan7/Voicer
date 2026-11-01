export const INTERVIEW_PREPARATION_SCHEMA = {
  type: 'object',
  properties: {
    resumeText: { type: 'string' },
    cheatSheet: { type: 'string' },
    recommendations: {
      type: 'object',
      properties: {
        topics: { type: 'array', items: { type: 'string' } },
        likelyQuestions: { type: 'array', items: { type: 'string' } },
        emphasize: { type: 'array', items: { type: 'string' } },
      },
      required: ['topics', 'likelyQuestions', 'emphasize'],
    },
  },
  required: ['resumeText', 'cheatSheet', 'recommendations'],
};

export function buildInterviewPreparationPrompt(vacancyText: string): string {
  return `Ты готовишь кандидата к собеседованию. Приложен PDF с резюме кандидата, ниже текст вакансии.

Верни JSON:
- resumeText: полный текст резюме простым текстом, без разметки.
- cheatSheet: сжатая шпаргалка примерно на 300 слов. Проекты кандидата, стек, конкретные цифры и достижения, затем ключевые требования вакансии и как опыт кандидата их закрывает. Только факты, без воды.
- recommendations.topics: 5–8 тем, которые стоит повторить перед собеседованием.
- recommendations.likelyQuestions: 8–12 вероятных вопросов интервьюера под эту вакансию.
- recommendations.emphasize: 4–6 сильных сторон кандидата, которые стоит подчеркнуть.

Пиши на языке вакансии, по умолчанию на русском.

Вакансия:
${vacancyText}`;
}
