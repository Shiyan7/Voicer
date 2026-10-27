import { tv } from 'tailwind-variants';

export const heatLevelStyles = tv({
  variants: {
    level: {
      0: 'bg-heat-0',
      1: 'bg-heat-1',
      2: 'bg-heat-2',
      3: 'bg-heat-3',
      4: 'bg-heat-4',
    },
  },
});
