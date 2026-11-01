export const INTERVIEW_PREPARATION_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
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
  required: ['title', 'cheatSheet', 'recommendations'],
};

export function buildInterviewPreparationPrompt(
  resumeText: string,
  vacancyText: string,
): string {
  return `Ты готовишь кандидата к собеседованию. Ниже резюме кандидата и текст вакансии.

Верни JSON:
- title: короткое название собеседования до 6 слов из вакансии: должность и компания, например «Senior Frontend, Яндекс». Без кавычек и даты.
- cheatSheet: сжатая шпаргалка примерно на 300 слов. Проекты кандидата, стек, конкретные цифры и достижения, затем ключевые требования вакансии и как опыт кандидата их закрывает. Только факты, без воды.
- recommendations.topics: 5–8 тем, которые стоит повторить перед собеседованием.
- recommendations.likelyQuestions: 8–12 вероятных вопросов интервьюера под эту вакансию.
- recommendations.emphasize: 4–6 сильных сторон кандидата, которые стоит подчеркнуть.

Пиши на языке вакансии, по умолчанию на русском.

Резюме:
${resumeText}

Вакансия:
${vacancyText}`;
}
