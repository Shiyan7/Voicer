export interface QuestionChipsProps {
  questions: string[];
  class?: string;
  isLoading: boolean;
  disabled: boolean;
  onAsk: (question: string) => void;
}
