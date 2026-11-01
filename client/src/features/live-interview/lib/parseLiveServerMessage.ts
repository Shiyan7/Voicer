import { LiveServerMessage } from '../types/LiveServerMessage';

export const parseLiveServerMessage = (
  data: unknown,
): LiveServerMessage | null => {
  if (typeof data !== 'string') return null;
  try {
    return JSON.parse(data) as LiveServerMessage;
  } catch {
    return null;
  }
};
