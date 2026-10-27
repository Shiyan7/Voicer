import { createMemo, JSX, splitProps } from 'solid-js';

import { iconStyles } from './Icon.styles';
import { sprites, type SpritesMeta } from './sprite.gen';

interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number;
  invert?: boolean;
}

export type IconName = {
  [Key in keyof SpritesMeta]: `${Key}:${SpritesMeta[Key]}`;
}[keyof SpritesMeta];

export function Icon(props: IconProps) {
  const [local, rest] = splitProps(props, ['name', 'class', 'invert', 'size']);

  const meta = createMemo(() => getIconMeta(local.name));

  const { viewBox, width, height } = meta().symbol;

  const axis = createMemo(() => {
    if (width === height) return 'square';
    const isX = width > height;
    return local.invert ? (isX ? 'y' : 'x') : isX ? 'x' : 'y';
  });

  return (
    <svg
      class={iconStyles({
        axis: axis(),
        class: local.class,
      })}
      style={{ '--icon-size': local.size ? `${local.size}px` : '24px' }}
      viewBox={viewBox}
      aria-hidden
      {...rest}
    >
      <use href={meta().href} />
    </svg>
  );
}

function getIconMeta(name: IconName) {
  const [spriteName, iconName] = name.split(':');
  return sprites.experimental_get(spriteName, iconName, {
    baseUrl: '/sprites/',
  })!;
}
