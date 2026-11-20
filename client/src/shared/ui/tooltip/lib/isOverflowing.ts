export const isOverflowing = (element: Element | null) =>
  Boolean(element && element.scrollWidth > element.clientWidth);
