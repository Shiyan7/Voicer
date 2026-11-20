import { JSX } from 'solid-js';

import { PanelPlacement } from '../../../types/PanelPlacement';

export interface ChatPanelProps {
  placement: PanelPlacement;
  showHint: boolean;
  canClear: boolean;
  bodyRef: (element: HTMLElement) => void;
  composer: JSX.Element;
  onClear: () => void;
  onClose: () => void;
  children: JSX.Element;
}
