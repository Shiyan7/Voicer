import { useUserMe } from '@/entities/user-me';
import { i18n } from '@/shared/i18n';
import { MODALS, showModal } from '@/shared/lib/modal';

import { TeamSelectDeps } from '../types/TeamSelectDeps';

export function useTeamSelect(props: TeamSelectDeps) {
  const { isAuthorized, user } = useUserMe();

  const firstLetterName = () => user()?.name[0].toUpperCase();

  const authLabel = () =>
    props.isCollapsed ? i18n.t('labels.log_in') : i18n.t('labels.auth_button');

  const openAuth = () => showModal(MODALS.AUTH);

  return {
    isAuthorized,
    user,
    firstLetterName,
    authLabel,
    openAuth,
  };
}
