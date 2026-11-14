import type { LiveTurn } from '../types/LiveTurn';

export const LIVE_AUDIO_PATH = '/live-audio';
export const LIVE_AUDIO_PROTOCOL = 'voicer.bearer';
export const SHORT_ANSWER_MIN_LENGTH = 80;

export const EMPTY_TURN: Omit<LiveTurn, 'id'> = {
  question: '',
  isQuestionFinal: false,
  answer: '',
  imageUrl: null,
};
