import { storage } from '@/shared/storage';

import {
  DEFAULT_FAB_POSITION,
  FAB_POSITION_KEY,
} from '../config/meetingChatConfig';
import { FabPosition } from '../types/FabPosition';

const isFabPosition = (value: unknown): value is FabPosition => {
  const candidate = value as FabPosition | null;
  return (
    (candidate?.side === 'left' || candidate?.side === 'right') &&
    typeof candidate.ratio === 'number'
  );
};

export const loadFabPosition = async (): Promise<FabPosition> => {
  try {
    const raw = await storage.getItem(FAB_POSITION_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isFabPosition(parsed) ? parsed : DEFAULT_FAB_POSITION;
  } catch {
    return DEFAULT_FAB_POSITION;
  }
};

export const saveFabPosition = (position: FabPosition) =>
  Promise.resolve(
    storage.setItem(FAB_POSITION_KEY, JSON.stringify(position)),
  ).catch(() => undefined);
