import { Accessor } from 'solid-js';

import { ChatMessagesDeps } from './ChatMessagesDeps';

export interface ChatSessionDeps extends ChatMessagesDeps {
  shouldFocus?: Accessor<boolean>;
  followAnswer?: boolean;
}
