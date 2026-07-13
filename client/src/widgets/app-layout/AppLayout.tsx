import { useLocation, useNavigate, useParams } from '@solidjs/router';
import { onMount, type ParentProps, Show, Suspense } from 'solid-js';

import { Toasts } from '@/entities/toasts';
import { AuthModal } from '@/features/auth';
import { CallRecorderHost } from '@/features/call-recorder';
import { ApplicationViewModel } from '@/shared/ApplicationViewModel';
import { i18n } from '@/shared/i18n';
import { isTauri } from '@/shared/isTauri';
import { useViewModel } from '@/shared/view-model';
import { Navigation } from '@/widgets/navigation';

import { appLayoutStyles } from './AppLayout.styles';

const styles = appLayoutStyles();

export function AppLayout(props: ParentProps) {
  const vm = useViewModel(ApplicationViewModel);

  const navigator = useNavigate();
  const params = useParams();
  const location = useLocation();

  onMount(() => {
    void i18n.init();
    vm.initApp();
    vm.initRouter(navigator, location, params);
  });

  return (
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
  );
}
