import { ParentProps } from 'solid-js';

export function PageFade(props: ParentProps) {
  return <div class="page-fade px-7 py-2">{props.children}</div>;
}
