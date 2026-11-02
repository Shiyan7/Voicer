import { SPEECH_LOCALES } from '../config/mockInterviewConfig';

interface InterviewerLine {
  text: string;
  language: string;
  audio: string | null;
}

const findVoice = (locale: string) =>
  speechSynthesis.getVoices().find((voice) => voice.lang === locale);

let activeUtterance: SpeechSynthesisUtterance | undefined;

const speak = (text: string, language: string, onEnd: () => void) => {
  speechSynthesis.cancel();
  const locale = SPEECH_LOCALES[language] ?? language;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.voice = findVoice(locale) ?? null;
  activeUtterance = utterance;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  speechSynthesis.speak(utterance);
};

const toAudioUrl = (audio: string) =>
  URL.createObjectURL(
    new Blob([Uint8Array.from(atob(audio), (char) => char.charCodeAt(0))], {
      type: 'audio/wav',
    }),
  );

let activeAudio: HTMLAudioElement | undefined;

export const playInterviewerLine = (
  { text, language, audio }: InterviewerLine,
  onEnd: () => void,
) => {
  if (!audio) {
    speak(text, language, onEnd);
    return;
  }
  const url = toAudioUrl(audio);
  const player = new Audio(url);
  activeAudio = player;
  player.onended = () => {
    URL.revokeObjectURL(url);
    onEnd();
  };
  player.play().catch((error: unknown) => {
    console.error('[mock-interview] audio playback failed:', error);
    URL.revokeObjectURL(url);
    speak(text, language, onEnd);
  });
};

export const stopSpeaking = () => {
  if (activeAudio) {
    activeAudio.onended = null;
    activeAudio.pause();
    activeAudio = undefined;
  }
  if (activeUtterance) {
    activeUtterance.onend = null;
    activeUtterance.onerror = null;
    activeUtterance = undefined;
  }
  speechSynthesis.cancel();
};
