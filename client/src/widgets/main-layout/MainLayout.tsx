import { useNavigate } from '@solidjs/router';
import { onMount, type ParentProps, Show, Suspense } from 'solid-js';

import { Toasts } from '@/entities/toasts';
import { AuthModal } from '@/features/auth';
import { ApplicationViewModel } from '@/shared/ApplicationViewModel';
import { i18n } from '@/shared/i18n';
import { useViewModel } from '@/shared/view-model';
import { Navigation } from '@/widgets/navigation';

export function MainLayout(props: ParentProps) {
  const app = useViewModel(ApplicationViewModel);

  const navigator = useNavigate();

  onMount(async () => {
    await i18n.init();
    app.initApp(navigator);
  });

  return (
    <Suspense>
      <Show when={i18n.ready}>
        <div class="grid min-h-screen grid-cols-[auto_1fr]">
          <Navigation />
          <main class="bg-neutral-50">
            <Suspense>
              {props.children}
              <Toasts />
            </Suspense>
          </main>
        </div>
        <AuthModal />
      </Show>
    </Suspense>
  );
}
