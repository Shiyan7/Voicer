import { type ParentProps, Show, Suspense } from 'solid-js';

import { Toasts, ToastsProvider } from '@/entities/toasts';
import { UserMeProvider } from '@/entities/user-me';
import { AuthModal } from '@/features/auth';
import { CallRecorderHost } from '@/features/call-recorder';
import { SearchOrchestrator } from '@/features/search';
import { Navigation } from '@/widgets/navigation';

import { appLayoutStyles } from './AppLayout.styles';
import { useAppLayout } from './model/useAppLayout';

const styles = appLayoutStyles();

export function AppLayout(props: ParentProps) {
  const vm = useAppLayout();

  return (
    <UserMeProvider>
      <ToastsProvider>
        <Suspense>
          <Show when={vm.ready()}>
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
            <SearchOrchestrator />
            <Show when={vm.isDesktop()}>
              <CallRecorderHost />
            </Show>
          </Show>
        </Suspense>
      </ToastsProvider>
    </UserMeProvider>
  );
}
