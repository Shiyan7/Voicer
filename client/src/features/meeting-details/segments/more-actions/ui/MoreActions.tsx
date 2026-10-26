import { createMemo } from 'solid-js';

import { useShowInFinder } from '@/features/meeting-details/segments/show-in-finder';
import { i18n } from '@/shared/i18n';
import { Dropdown, DropdownOption } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { MoreActionsParams } from '../types/MoreActionsParams';
import { moreActionsStyles } from './MoreActions.styles';

type MoreAction = 'show-in-finder';

const styles = moreActionsStyles();

export function MoreActions(props: MoreActionsParams) {
  const finder = useShowInFinder({
    get audioUrl() {
      return props.audioUrl ?? '';
    },
    get fileName() {
      return props.fileName ?? '';
    },
  });

  const options = createMemo<DropdownOption<MoreAction>[]>(() =>
    props.audioUrl
      ? [
          {
            value: 'show-in-finder',
            label: i18n.t('meetings.show_in_finder'),
            icon: 'common:folder',
          },
        ]
      : [],
  );

  const handleSelect = (action: MoreAction) => {
    if (action === 'show-in-finder') void finder.reveal();
  };

  return (
    <Dropdown
      options={options()}
      onSelect={handleSelect}
      triggerClass={styles.trigger()}
      trigger={() => <Icon size={16} name="common:dots" />}
    />
  );
}
