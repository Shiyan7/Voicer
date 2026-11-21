import { ChatAnswerRequest } from './chat-answer-request';
import { ChatReply } from './chat-reply';

export interface ChatResponder {
  reply(request: ChatAnswerRequest): Promise<ChatReply>;
}
