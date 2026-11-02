import { isTauri } from '@tauri-apps/api/core';
import { onCleanup, onMount } from 'solid-js';

import {
  MOUSE_BACK_BUTTON,
  MOUSE_FORWARD_BUTTON,
} from '../config/appLayoutConfig';

export const useMouseHistoryNavigation = () => {
  const onMouseUp = (event: MouseEvent) => {
    if (event.button === MOUSE_BACK_BUTTON) history.back();
    if (event.button === MOUSE_FORWARD_BUTTON) history.forward();
  };

  onMount(() => {
    if (!isTauri()) return;
    window.addEventListener('mouseup', onMouseUp);
    onCleanup(() => window.removeEventListener('mouseup', onMouseUp));
  });
};
