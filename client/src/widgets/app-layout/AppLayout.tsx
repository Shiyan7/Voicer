import { type ParentProps, Show, Suspense } from 'solid-js';

import { Toasts } from '@/entities/toasts';
import { AuthModal } from '@/features/auth';
import { CallRecorderHost } from '@/features/call-recorder';
import { SingletonProvider } from '@/shared/singleton';
import { Navigation } from '@/widgets/navigation';

import { appLayoutStyles } from './AppLayout.styles';
import { useAppLayout } from './model/useAppLayout';

const styles = appLayoutStyles();

export function AppLayout(props: ParentProps) {
  const vm = useAppLayout();

  return (
    <SingletonProvider>
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
          <Show when={vm.isDesktop()}>
            <CallRecorderHost />
          </Show>
        </Show>
      </Suspense>
    </SingletonProvider>
  );
}
