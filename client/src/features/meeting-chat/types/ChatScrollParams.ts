import { Accessor } from 'solid-js';

export interface ChatScrollParams {
  isOpen: Accessor<boolean>;
  draft: Accessor<string>;
  scrollTrigger: Accessor<unknown>;
  onSubmit: () => void;
}
