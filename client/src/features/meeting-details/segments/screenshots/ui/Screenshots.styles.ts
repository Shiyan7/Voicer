import { tv } from 'tailwind-variants';

export const screenshotsStyles = tv({
  slots: {
    grid: 'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4',
    item: 'flex flex-col items-start gap-2',
    thumb: `
      aspect-video w-full overflow-hidden rounded-xl border border-gray-200
      bg-gray-100 transition-shadow hover:shadow-md
      outline-none focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    image: 'size-full object-cover',
  },
});
