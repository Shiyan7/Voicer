export interface QuestionChipsProps {
  questions: string[];
  isLoading: boolean;
  disabled: boolean;
  onAsk: (question: string) => void;
}
