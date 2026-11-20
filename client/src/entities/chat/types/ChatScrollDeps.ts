import { Accessor } from 'solid-js';

export interface ChatScrollDeps {
  shouldFocus: Accessor<boolean>;
  draft: Accessor<string>;
  scrollTrigger: Accessor<unknown>;
  onSubmit: () => void;
}
