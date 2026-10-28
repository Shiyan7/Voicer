import { Accessor } from 'solid-js';

export interface DraggableFabParams {
  boundary: Accessor<HTMLElement | undefined>;
  obstacle: Accessor<HTMLElement | undefined>;
  onTap: () => void;
}
