const isScrollable = (element: HTMLElement) =>
  /(auto|scroll)/.test(getComputedStyle(element).overflowY);

export const getScrollParent = (element: HTMLElement): HTMLElement => {
  let parent = element.parentElement;
  while (parent && !isScrollable(parent)) parent = parent.parentElement;
  return parent ?? document.documentElement;
};
