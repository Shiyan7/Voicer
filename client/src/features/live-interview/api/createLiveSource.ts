import { USE_MOCK_LIVE_SOURCE } from '../config/liveInterviewConfig';
import { LiveSource } from '../types/LiveSource';
import { createMockLiveSource } from './createMockLiveSource';
import { createServerLiveSource } from './createServerLiveSource';

export const createLiveSource = (sessionId: string): LiveSource =>
  USE_MOCK_LIVE_SOURCE
    ? createMockLiveSource()
    : createServerLiveSource(sessionId);
