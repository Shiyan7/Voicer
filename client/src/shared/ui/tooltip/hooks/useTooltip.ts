import { createSignal } from 'solid-js';

import { getTooltipAnchor } from '../lib/getTooltipAnchor';
import { isOverflowing } from '../lib/isOverflowing';
import { TooltipProps } from '../types/TooltipProps';

export const useTooltip = (props: TooltipProps) => {
  const [root, setRoot] = createSignal<HTMLElement>();
  const [isHovered, setIsHovered] = createSignal(false);

  const position = () => props.position ?? 'top';

  const isVisible = () => isHovered() || Boolean(props.isOpen);

  const anchor = () => {
    const element = root();
    if (!element || !isVisible()) return null;
    const { left, top } = getTooltipAnchor(
      element.getBoundingClientRect(),
      position(),
    );
    return { left: `${left}px`, top: `${top}px` };
  };

  const canShow = () =>
    !props.overflowOnly || isOverflowing(root()?.firstElementChild ?? null);

  const show = () => setIsHovered(canShow());

  const hide = () => setIsHovered(false);

  return { setRoot, position, anchor, show, hide };
};
