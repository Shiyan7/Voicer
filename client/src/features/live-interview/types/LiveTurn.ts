export interface LiveTurn {
  id: string;
  question: string;
  isQuestionFinal: boolean;
  answer: string;
  imageUrl: string | null;
}
