import '@solidjs/router';

const readDepth = (): number => window.history.state?._depth ?? 0;

const entryDepth = readDepth();

export const canGoBack = (): boolean => readDepth() > entryDepth;
