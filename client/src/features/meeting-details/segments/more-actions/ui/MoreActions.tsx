import { DeleteMeetingModal } from '@/entities/meeting';
import { Dropdown } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { useMoreActions } from '../model/useMoreActions';
import { MoreActionsDeps } from '../types/MoreActionsDeps';
import { moreActionsStyles } from './MoreActions.styles';

const styles = moreActionsStyles();

export function MoreActions(props: MoreActionsDeps) {
  const vm = useMoreActions(props);

  return (
    <>
      <Dropdown
        options={vm.options()}
        onSelect={vm.selectAction}
        triggerClass={styles.trigger()}
        trigger={() => <Icon size={18} name="common:dots" />}
      />
      <DeleteMeetingModal
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDelete}
        onCancel={vm.cancelDelete}
      />
    </>
  );
}
