import { SummaryStyle } from '../summary-style.enum';

export const SUMMARY_STYLE_INSTRUCTIONS: Record<SummaryStyle, string> = {
  [SummaryStyle.AUTO]:
    'Pick the length and tone that best fit this particular conversation.',
  [SummaryStyle.CONCISE]:
    'Be brief: 3–5 key points, one short sentence each. Keep only what truly matters and drop minor details.',
  [SummaryStyle.DETAILED]:
    'Be thorough: 8–15 key points. For each one give the context — who said what, why it was decided this way, which alternatives were discussed.',
  [SummaryStyle.BULLETS]:
    'Write key points as terse note-style theses, not full sentences: noun phrases and facts like «Релиз — 15 ноября», «Бюджет: +20%». No filler words.',
  [SummaryStyle.CASUAL]:
    'Explain in plain words, like retelling the conversation to a friend: no jargon or technical terms; if a term is unavoidable, explain it.',
  [SummaryStyle.WORK]:
    'Treat it as a work call. Key points must cover: decisions made, blockers and risks, open questions. Action items must name who is responsible when the transcript reveals it.',
  [SummaryStyle.INTERVIEW]:
    'Treat it as a job interview. Key points must cover the candidate: background and experience, strengths, weaknesses, red flags, and an overall impression. Action items are next steps of the hiring process.',
  [SummaryStyle.ADVICE]:
    'Act as a thoughtful friend giving the user personal advice based on this conversation. The user is one of the speakers. Key points must first briefly describe the situation and what is bothering the people involved, then give 2–4 honest, practical pieces of advice: what the user could do, say or reconsider, and why. Be supportive but direct, no moralising. When writing in Russian, address the user politely with «вы», never «ты». Action items are concrete small steps the user can take.',
};
