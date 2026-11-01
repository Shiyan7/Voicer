import { InterviewSessionView } from './InterviewSessionView';

export interface InterviewSessionItemProps {
  session: InterviewSessionView;
  onOpen: (id: string) => void;
}
