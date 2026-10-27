export const revealWhen =
  (shouldReveal: boolean) =>
  (element: HTMLElement): void => {
    if (!shouldReveal) return;

    requestAnimationFrame(() => element.scrollIntoView({ block: 'center' }));
  };
