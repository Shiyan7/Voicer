import { Accessor } from 'solid-js';

export interface DraggableFabDeps {
  boundary: Accessor<HTMLElement | undefined>;
  obstacle: Accessor<HTMLElement | undefined>;
  onTap: () => void;
}
