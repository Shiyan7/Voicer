import { createMemo } from 'solid-js';

import { GallerySlide, openGallery } from '@/shared/lib/gallery';
import { settingsRoot } from '@/shared/roots/settingsRoot';

import { toEmptyHint } from '../lib/toEmptyHint';
import { toScreenshotView } from '../lib/toScreenshotView';
import { ScreenshotsDeps } from '../types/ScreenshotsDeps';

export const useScreenshots = (deps: ScreenshotsDeps) => {
  const items = createMemo(() => deps.screenshots.map(toScreenshotView));

  const slides = (): GallerySlide[] =>
    items().map((item) => ({
      src: item.url,
      thumbSrc: item.thumbUrl,
      caption: item.timeLabel,
    }));

  const open = (index: number) => openGallery(slides(), index);

  const isEmpty = () => items().length === 0;

  const emptyHint = () => toEmptyHint(settingsRoot.screenshotIntervalSec);

  return { isEmpty, emptyHint, items, open };
};
