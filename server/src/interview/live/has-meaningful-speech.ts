const FILLER_WORDS = new Set([
  'ага',
  'угу',
  'да',
  'нет',
  'понятно',
  'понял',
  'поняла',
  'окей',
  'ок',
  'хорошо',
  'ясно',
  'так',
  'ну',
  'вот',
  'отлично',
  'супер',
  'спасибо',
  'ok',
  'okay',
  'yeah',
  'yes',
  'right',
  'got',
  'it',
  'cool',
  'great',
  'thanks',
  'mm',
  'hmm',
  'uh',
  'um',
]);

const toWords = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

export function hasMeaningfulSpeech(text: string): boolean {
  return toWords(text).some((word) => !FILLER_WORDS.has(word));
}
