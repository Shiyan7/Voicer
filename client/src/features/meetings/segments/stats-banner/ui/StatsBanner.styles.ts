import { tv } from 'tailwind-variants';

export const statsBannerStyles = tv({
  slots: {
    root: `
      relative overflow-hidden rounded-2xl
      bg-linear-to-r from-banner-from via-banner-via to-banner-to px-7 py-6
    `,
    glow: `
      pointer-events-none absolute -right-16 -top-20 size-64 rounded-full
      bg-banner-glow/50 blur-3xl
    `,
    greeting: 'relative text-2xl font-semibold tracking-title text-gray-900',
    subtitle: 'relative mt-1 text-[15px] text-gray-600',
    tiles: 'relative mt-5 flex flex-wrap gap-3',
    tile: `
      flex min-w-32 flex-col gap-0.5 rounded-xl bg-white/70 px-4 py-3
      backdrop-blur-sm
    `,
    tileValue: 'text-xl font-semibold text-gray-900 tabular-nums',
    tileLabel: 'text-[13px] text-gray-500',
    tileSkeleton: 'h-[68px] w-32 animate-pulse rounded-xl bg-white/60',
  },
});
