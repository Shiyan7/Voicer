import { Icon, IconName } from '@/shared/ui/icon';

import { listFiltersStyles } from './ListFilters.styles';

interface ToggleFilterProps {
  icon: IconName;
  title: string;
  isActive: boolean;
  onToggle: () => void;
}

const styles = listFiltersStyles();

export function ToggleFilter(props: ToggleFilterProps) {
  return (
    <button
      class={styles.iconBtn({ active: props.isActive })}
      type="button"
      title={props.title}
      aria-label={props.title}
      aria-pressed={props.isActive}
      onClick={props.onToggle}
    >
      <Icon size={20} name={props.icon} />
    </button>
  );
}
