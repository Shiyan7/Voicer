import { ChatMessageOutput } from '@schema';

export const snapshotMessages = (
  storeMessages: ChatMessageOutput[],
): ChatMessageOutput[] => storeMessages.map((message) => ({ ...message }));
