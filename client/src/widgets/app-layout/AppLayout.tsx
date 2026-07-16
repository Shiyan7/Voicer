import { isTauri } from '@tauri-apps/api/core';
import { onMount, type ParentProps, Show, Suspense } from 'solid-js';

import { Toasts } from '@/entities/toasts';
import { AuthModal } from '@/features/auth';
import { CallRecorderHost } from '@/features/call-recorder';
import { i18n } from '@/shared/i18n';
import { SingletonProvider } from '@/shared/singleton';
import { Navigation } from '@/widgets/navigation';

import { appLayoutStyles } from './AppLayout.styles';

const styles = appLayoutStyles();

export function AppLayout(props: ParentProps) {
  onMount(() => {
    void i18n.init();
  });

  return (
    <SingletonProvider>
      <Suspense>
        <Show when={i18n.ready}>
          <div class={styles.root()}>
            <Navigation />
            <main class={styles.main()}>
              <Suspense>
                {props.children}
                <Toasts />
              </Suspense>
            </main>
          </div>
          <AuthModal />
          <Show when={isTauri()}>
            <CallRecorderHost />
          </Show>
        </Show>
      </Suspense>
    </SingletonProvider>
  );
}
