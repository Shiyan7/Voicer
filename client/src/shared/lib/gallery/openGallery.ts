import '@fancyapps/ui/dist/fancybox/fancybox.css';

import { Fancybox } from '@fancyapps/ui/dist/fancybox/';

import { GALLERY_TOOLBAR } from './config/GALLERY_TOOLBAR';
import { GallerySlide } from './GallerySlide';

export const openGallery = (slides: GallerySlide[], startIndex = 0) => {
  if (!slides.length) return;
  Fancybox.show(slides, {
    startIndex,
    Carousel: { Toolbar: { display: GALLERY_TOOLBAR } },
  });
};
