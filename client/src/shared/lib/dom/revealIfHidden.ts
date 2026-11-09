interface ViewportInset {
  top: number;
  bottom: number;
}

export const revealIfHidden = (
  element: Element | null | undefined,
  inset: ViewportInset,
) => {
  if (!element) return;

  const { top, bottom } = element.getBoundingClientRect();
  const isVisible =
    top >= inset.top && bottom <= window.innerHeight - inset.bottom;

  if (!isVisible)
    element.scrollIntoView({ block: 'center', behavior: 'instant' });
};
