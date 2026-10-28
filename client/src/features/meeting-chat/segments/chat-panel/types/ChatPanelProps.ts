import { JSX } from 'solid-js';

import { PanelPlacement } from '../../../types/PanelPlacement';

export interface ChatPanelProps {
  placement: PanelPlacement;
  showHint: boolean;
  canClear: boolean;
  canSend: boolean;
  draft: string;
  bodyRef: (element: HTMLElement) => void;
  inputRef: (element: HTMLTextAreaElement) => void;
  onDraft: (value: string) => void;
  onInputKeyDown: (event: KeyboardEvent) => void;
  onSubmit: () => void;
  onClear: () => void;
  onClose: () => void;
  children: JSX.Element;
}
