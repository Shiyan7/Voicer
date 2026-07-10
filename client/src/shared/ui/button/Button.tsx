import type { ParentProps, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';
import { Dynamic, DynamicProps } from 'solid-js/web';
import { type VariantProps } from 'tailwind-variants';

import { buttonStyles } from './Button.styles';

type ButtonProps<T extends ValidComponent = 'button'> = ParentProps &
  VariantProps<typeof buttonStyles> & {
    as?: T;
    class?: string;
  } & Omit<DynamicProps<T>, 'component'>;

export function Button<T extends ValidComponent>(props: ButtonProps<T>) {
  const [local, rest] = splitProps(props, ['as', 'class', 'variant', 'size']);

  return (
    <Dynamic
      class={buttonStyles({
        variant: local.variant,
        size: local.size,
        class: local.class,
      })}
      component={local.as ?? 'button'}
      {...rest}
    />
  );
}
