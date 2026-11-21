import { Accessor } from 'solid-js';

export interface ChatScrollDeps {
  threadId: Accessor<string | undefined>;
  hasMessages: Accessor<boolean>;
  shouldFocus?: Accessor<boolean>;
  draft: Accessor<string>;
  scrollTrigger: Accessor<unknown>;
  onSubmit: () => void;
}
