import { ChatMessageOutput } from '@schema';

const byCreatedAt = (a: ChatMessageOutput, b: ChatMessageOutput) =>
  a.createdAt.localeCompare(b.createdAt);

export const mergeMessages = (
  current: ChatMessageOutput[],
  incoming: ChatMessageOutput[],
): ChatMessageOutput[] => {
  const incomingIds = new Set(incoming.map(({ id }) => id));
  return [
    ...current.filter(({ id }) => !incomingIds.has(id)),
    ...incoming,
  ].sort(byCreatedAt);
};
