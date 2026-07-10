import { A } from '@solidjs/router';
import { For, Show } from 'solid-js';

import { SessionViewModel } from '@/entities/session';
import { i18n, languages, Locale } from '@/shared/i18n';
import { MODALS, showModal } from '@/shared/lib/modal';
import { paths } from '@/shared/router';
import { Button } from '@/shared/ui/button';
import { useViewModel } from '@/shared/view-model';

import { headerStyles } from './Header.styles';

const styles = headerStyles();

export function Header() {
  const session = useViewModel(SessionViewModel);

  const handleLangChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    i18n.changeLang(target.value as Locale);
  };

  return (
    <header>
      <div class={styles.container()}>
        <A class={styles.logo()} href={paths.home}>
          {i18n.t('common.brand_url')}
        </A>
        <div class={styles.right()}>
          <select
            class={styles.select()}
            onChange={handleLangChange}
            value={i18n.locale()}
          >
            <For each={languages}>
              {(lang) => <option value={lang.value}>{lang.label}</option>}
            </For>
          </select>
          <Show
            when={session.isAuthorized}
            fallback={
              <Button onClick={() => showModal(MODALS.AUTH)}>
                {i18n.t('labels.auth_button')}
              </Button>
            }
          >
            <Button as={A} href={paths.settings}>
              {i18n.t('labels.settings')}
            </Button>
          </Show>
        </div>
      </div>
    </header>
  );
}
