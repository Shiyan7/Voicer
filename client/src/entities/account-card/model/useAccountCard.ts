import { useUserMe } from '@/entities/user-me';
import { i18n } from '@/shared/i18n';
import { MODALS, showModal } from '@/shared/lib/modal';
import { paths } from '@/shared/router';

import { AccountCardDeps } from '../types/AccountCardDeps';

export const useAccountCard = (props: AccountCardDeps) => {
  const { isAuthorized, user } = useUserMe();

  const firstLetterName = () => user()?.name[0]?.toUpperCase() ?? '';

  const avatarUrl = () => user()?.avatar ?? null;

  const name = () => user()?.name ?? '';

  const email = () => user()?.email ?? '';

  const accountHref = paths.settings;

  const authLabel = () =>
    props.isCollapsed ? i18n.t('labels.log_in') : i18n.t('labels.auth_button');

  const openAuth = () => showModal(MODALS.AUTH);

  return {
    isAuthorized,
    firstLetterName,
    avatarUrl,
    name,
    email,
    accountHref,
    authLabel,
    openAuth,
  };
};
