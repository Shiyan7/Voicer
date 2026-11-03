import { Accessor } from 'solid-js';

export interface ChatScrollDeps {
  isOpen: Accessor<boolean>;
  draft: Accessor<string>;
  scrollTrigger: Accessor<unknown>;
  onSubmit: () => void;
}
